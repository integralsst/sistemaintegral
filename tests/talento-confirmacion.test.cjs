/* eslint-disable @typescript-eslint/no-require-imports -- Pruebas aisladas de rutas Next con mocks de Prisma/Cloudinary. */
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
const hashToken = token => createHash('sha256').update(token).digest('hex');
const TOKEN = 'a'.repeat(64);
const LEGACY_CUID = 'c' + 'a'.repeat(24);

let application;
let created;
let lookedUp;
let updates;
let cloudinaryChecked;

const prisma = {
  postulacionTalento: {
    count: async () => 0,
    create: async ({ data }) => {
      created = data;
      application = {
        id: data.id,
        estado: 'PENDIENTE',
        tokenHash: data.tokenHash,
        tokenExpiraEn: data.tokenExpiraEn,
        hojaVidaPublicId: data.hojaVidaPublicId,
      };
      return { id: data.id };
    },
    findUnique: async ({ where }) => {
      lookedUp++;
      return where.id === application?.id ? application : null;
    },
    updateMany: async ({ where, data }) => {
      updates++;
      assert.equal(where.id, application.id);
      assert.equal(data.estado, 'RECIBIDA');
      return { count: 1 };
    },
  },
};

const cloudinary = {
  CV_MAX_BYTES: 10 * 1024 * 1024,
  UPLOAD_EXPIRY_MINUTES: 20,
  cloudinaryConfig: () => ({ cloudName: 'test-cloud', apiKey: 'test-key', apiSecret: 'test-secret' }),
  hashToken,
  newToken: () => TOKEN,
  signCloudinary: () => 'test-signature',
  parseCandidate: () => ({
    fullName: 'Perfil de prueba', email: 'prueba@example.com',
    phone: '3000000000', city: 'Pereira', profession: 'Profesional SST',
    experienceYears: 5, availability: 'VIRTUAL',
    message: null, cvFileName: 'perfil.pdf',
    utmSource: null, utmMedium: null, utmCampaign: null, utmContent: null,
  }),
  readCloudinaryAsset: async publicId => {
    cloudinaryChecked++;
    return {
      assetId: 'asset-test-1',
      publicId,
      resourceType: 'raw',
      type: 'authenticated',
      format: 'pdf',
      bytes: 4096,
    };
  },
};

Module._extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
}).outputText, file);

Module._load = function (name, parent, isMain) {
  if (name === 'next/server') return { NextResponse: { json: (data, options) => Response.json(data, options) } };
  if (name === '@/lib/prisma') return { prisma };
  if (name === '@/lib/talento') return cloudinary;
  if (name.startsWith('@/')) name = path.join(root, name.slice(2) + '.ts');
  return originalLoad.call(this, name, parent, isMain);
};

const start = require('../app/api/talento/iniciar/route.ts');
const confirm = require('../app/api/talento/confirmar/route.ts');

function request(route, body) {
  return new Request('https://sis.test/api/talento/' + route, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  created = null;
  application = null;
  lookedUp = 0;
  updates = 0;
  cloudinaryChecked = 0;
});

after(() => {
  Module._load = originalLoad;
  if (originalTs) Module._extensions['.ts'] = originalTs;
  else delete Module._extensions['.ts'];
});

test('inicio persiste UUID y lo reutiliza como identificador del PDF', async () => {
  const response = await start.POST(request('iniciar', { consent: true }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.match(body.applicationId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(created.id, body.applicationId);
  assert.equal(created.hojaVidaPublicId, `talento-sis/${body.applicationId}.pdf`);
  assert.equal(created.tokenHash, hashToken(TOKEN));
  assert.equal(body.confirmationToken, TOKEN);
});

test('confirmación de UUID nuevo verifica PDF privado y registra recepción', async () => {
  const startResponse = await start.POST(request('iniciar', { consent: true }));
  const { applicationId, confirmationToken } = await startResponse.json();
  const response = await confirm.POST(request('confirmar', { applicationId, confirmationToken }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).applicationId, applicationId);
  assert.equal(lookedUp, 1);
  assert.equal(cloudinaryChecked, 1);
  assert.equal(updates, 1);
});

test('confirmación de CUID heredado permanece compatible', async () => {
  application = {
    id: LEGACY_CUID,
    estado: 'PENDIENTE',
    tokenHash: hashToken(TOKEN),
    tokenExpiraEn: new Date(Date.now() + 60_000),
    hojaVidaPublicId: 'talento-sis/legacy.pdf',
  };
  const response = await confirm.POST(request('confirmar', {
    applicationId: LEGACY_CUID,
    confirmationToken: TOKEN,
  }));
  assert.equal(response.status, 200);
  assert.equal(lookedUp, 1);
  assert.equal(updates, 1);
});

test('confirmación rechaza IDs malformados y no consulta datos personales', async () => {
  for (const applicationId of ['../../otro', 'a'.repeat(300), '', 'c' + 'a'.repeat(23)]) {
    const response = await confirm.POST(request('confirmar', { applicationId, confirmationToken: TOKEN }));
    assert.equal(response.status, 400);
  }
  assert.equal(lookedUp, 0);
  assert.equal(updates, 0);
});

test('token inválido impide confirmar incluso con ID válido', async () => {
  await start.POST(request('iniciar', { consent: true }));
  const response = await confirm.POST(request('confirmar', {
    applicationId: application.id,
    confirmationToken: 'b'.repeat(64),
  }));
  assert.equal(response.status, 403);
  assert.equal(updates, 0);
  assert.equal(cloudinaryChecked, 0);
});
