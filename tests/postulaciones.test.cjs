/* eslint-disable @typescript-eslint/no-require-imports -- Node loader hooks isolate route handlers from external services. */
const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const originalLoad = Module._load;
const originalTs = Module._extensions['.ts'];
let token, session, active, calls, state;
const id = '00000000-0000-4000-8000-000000000001';
const sample = { id, nombreCompleto: 'Perfil de prueba aislado', estado: 'RECIBIDA' };
const db = {
  user: { findUnique: async () => active },
  postulacionTalento: {
    count: async args => { calls.push(['count', args]); return 1; },
    groupBy: async args => { calls.push(['groupBy', args]); return [{ ciudad: 'Pereira' }]; },
    findMany: async args => { calls.push(['findMany', args]); return [sample]; },
    findFirst: async args => { calls.push(['findFirst', args]); return args.select.hojaVidaPublicId ? { hojaVidaPublicId: 'talento-sis/test.pdf' } : sample; },
    updateMany: async args => { calls.push(['updateMany', args]); state = args.data.estado; return { count: 1 }; },
  },
  $transaction: async queries => Promise.all(queries),
};
Module._extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
Module._load = function (name, parent, isMain) {
  if (name === 'server-only') return {};
  if (name === 'next/headers') return { cookies: async () => ({ get: () => token ? { value: token } : undefined }) };
  if (name === '@/lib/auth') return { verifySessionToken: async () => { if (token === 'invalid') throw new Error('invalid'); return session; } };
  if (name === '@/lib/prisma') return { prisma: db };
  if (name.startsWith('@/')) name = path.join(root, name.slice(2) + '.ts');
  return originalLoad.call(this, name, parent, isMain);
};
const list = require('../app/api/admin/postulaciones/route.ts');
const detail = require('../app/api/admin/postulaciones/[id]/route.ts');
const pdf = require('../app/api/admin/postulaciones/[id]/pdf/route.ts');
const { temporaryPdfUrl, confirmedWhere } = require('../lib/postulaciones-admin.ts');
const context = { params: Promise.resolve({ id }) };
const request = (url = '', init) => new Request('https://sis.test/api/admin/postulaciones' + url, init);
const mutation = body => request('/' + id, { method: 'PATCH', headers: { Origin: 'https://sis.test' }, body });
beforeEach(() => {
  token = 'valid'; session = { role: 'ADMIN', userId: 'admin' }; active = { role: 'ADMIN', isActive: true }; calls = []; state = 'RECIBIDA';
});
after(() => { Module._load = originalLoad; if (originalTs) Module._extensions['.ts'] = originalTs; else delete Module._extensions['.ts']; });

test('all handlers deny missing, invalid, USER, inactive and revoked sessions before reading candidates', async () => {
  const handlers = [() => list.GET(request()), () => detail.GET(request(), context), () => detail.PATCH(mutation('{}'), context), () => pdf.GET(request(), context), () => pdf.POST(request(), context)];
  for (const scenario of ['missing', 'invalid', 'USER', 'inactive', 'revoked']) {
    token = scenario === 'missing' ? null : scenario === 'invalid' ? 'invalid' : 'valid';
    session = { role: scenario === 'USER' ? 'USER' : 'ADMIN', userId: 'admin' };
    active = { role: scenario === 'revoked' ? 'USER' : 'ADMIN', isActive: scenario !== 'inactive' };
    for (const handler of handlers) {
      const response = await handler(); assert.equal(response.status, ['missing', 'invalid'].includes(scenario) ? 401 : 403); assert.match(response.headers.get('cache-control'), /no-store/);
    }
  }
  assert.equal(calls.length, 0);
});
test('strict filter and pagination validation prevents candidate queries', async () => {
  for (const query of ['page=0', 'page=1.2', 'pageSize=51', 'estado=PENDIENTE', 'q=' + 'x'.repeat(121), 'page=1&page=2', 'internal=1']) {
    assert.equal((await list.GET(request('?' + query))).status, 400);
  }
  assert.equal(calls.length, 0);
});
test('list filters, stable ordering and pagination are passed to Prisma, with an explicit safe selection', async () => {
  const response = await list.GET(request('?page=2&pageSize=10&q=SST&ciudad=Pereira&estado=EN_REVISION'));
  assert.equal(response.status, 200);
  const query = calls.find(([method]) => method === 'findMany')[1];
  assert.equal(query.skip, 10); assert.equal(query.take, 10); assert.deepEqual(query.where.AND[0], confirmedWhere);
  assert.equal(query.where.AND[1].ciudad, 'Pereira'); assert.equal(query.where.AND[1].estado, 'EN_REVISION');
  assert.equal(query.where.AND[1].OR.length, 3); assert.deepEqual(query.orderBy, [{ creadoEn: 'desc' }, { id: 'desc' }]);
  for (const field of ['tokenHash', 'ipHash', 'hojaVidaPublicId', 'tokenExpiraEn']) assert.equal(query.select[field], undefined);
});
test('every read and update requires a confirmed application with registered bytes and asset ID', async () => {
  assert.deepEqual(confirmedWhere.estado.in, ['RECIBIDA', 'EN_REVISION', 'DESCARTADA']);
  assert.deepEqual(confirmedWhere.hojaVidaAssetId, { not: null }); assert.equal(confirmedWhere.hojaVidaBytes.lte, 10 * 1024 * 1024);
  await detail.GET(request(), context); await detail.PATCH(mutation('{"estado":"EN_REVISION"}'), context);
  for (const [, args] of calls) assert.deepEqual(args.where.AND[0], confirmedWhere);
});
test('detail rejects invalid IDs and selects only necessary personal fields', async () => {
  assert.equal((await detail.GET(request(), { params: Promise.resolve({ id: '../../bad' }) })).status, 400);
  await detail.GET(request(), context);
  const query = calls.find(([method]) => method === 'findFirst')[1];
  assert.equal(query.select.telefono, true); assert.equal(query.select.utmCampaign, true);
  assert.equal(query.select.tokenHash, undefined); assert.equal(query.select.ipHash, undefined);
});
test('state changes call Prisma and support both review transitions', async () => {
  for (const estado of ['EN_REVISION', 'DESCARTADA']) {
    assert.equal((await detail.PATCH(mutation(JSON.stringify({ estado })), context)).status, 200); assert.equal(state, estado);
  }
});
test('state changes reject malformed bodies, extra fields, unsupported states and cross-site requests', async () => {
  for (const body of ['{', '{}', 'null', '[]', '{"estado":"RECIBIDA"}', '{"estado":"EN_REVISION","id":"bad"}']) assert.equal((await detail.PATCH(mutation(body), context)).status, 400);
  assert.equal((await detail.PATCH(request('', { method: 'PATCH', headers: { Origin: 'https://other.test' }, body: '{}' }), context)).status, 403);
  assert.equal(calls.length, 0);
});
test('same-origin check accepts Next internal localhost normalization without accepting foreign origins', async () => {
  const make = origin => new Request('http://localhost:3100/api/admin/postulaciones/' + id, { method: 'PATCH', headers: { Host: '127.0.0.1:3100', Origin: origin }, body: '{"estado":"EN_REVISION"}' });
  assert.equal((await detail.PATCH(make('http://127.0.0.1:3100'), context)).status, 200);
  assert.equal((await detail.PATCH(make('https://other.test'), context)).status, 403);
});
test('PDF links use the official raw/download API, authenticated delivery and a signed two-minute expiration', async () => {
  const saved = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].map(key => [key, process.env[key]]);
  try {
    process.env.CLOUDINARY_CLOUD_NAME = 'isolated-test'; process.env.CLOUDINARY_API_KEY = 'test-key'; process.env.CLOUDINARY_API_SECRET = 'test-secret';
    for (const download of [false, true]) {
      const signed = temporaryPdfUrl('talento-sis/test.pdf', download, 1700000000000); const url = new URL(signed.url); const params = url.searchParams;
      assert.equal(url.pathname, '/v1_1/isolated-test/raw/download'); assert.equal(params.get('type'), 'authenticated');
      assert.equal(params.get('public_id'), 'talento-sis/test.pdf'); assert.equal(params.get('format'), 'pdf');
      assert.equal(Number(params.get('expires_at')) - Number(params.get('timestamp')), 120); assert.equal(params.get('attachment'), String(download));
      const message = ['attachment', 'expires_at', 'format', 'public_id', 'timestamp', 'type'].map(key => `${key}=${params.get(key)}`).join('&');
      assert.equal(params.get('signature'), createHash('sha1').update(message + 'test-secret').digest('hex')); assert(!signed.url.includes('test-secret'));
    }
    const inline = await pdf.POST(request('/' + id + '/pdf', { method: 'POST', headers: { Origin: 'https://sis.test' } }), context);
    assert.equal(inline.status, 200); assert.match(inline.headers.get('cache-control'), /no-store/);
    const payload = await inline.json(); assert(new URL(payload.url).searchParams.has('expires_at'));
    const download = await pdf.GET(request('/' + id + '/pdf?mode=download'), context);
    assert.equal(download.status, 303); assert.equal(new URL(download.headers.get('location')).searchParams.get('attachment'), 'true');
    assert.equal((await pdf.GET(request('/' + id + '/pdf?mode=public'), context)).status, 400);
    assert.equal((await pdf.GET(request('/' + id + '/pdf?mode=inline&mode=download'), context)).status, 400);
  } finally { for (const [key, value] of saved) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
});
