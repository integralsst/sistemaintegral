import { prisma } from "@/lib/prisma";
import { authorizeAdmin, confirmedWhere, detailSelect, json, sameOrigin, validId } from "@/lib/postulaciones-admin";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  try {
    const denied = await authorizeAdmin();
    if (denied) return denied;
    const { id } = await context.params;
    if (!validId(id)) return json({ error: "Identificador inválido." }, 400);
    const item = await prisma.postulacionTalento.findFirst({
      where: { AND: [confirmedWhere, { id }] }, select: detailSelect,
    });
    return item ? json(item) : json({ error: "Postulación no encontrada." }, 404);
  } catch {
    return json({ error: "No pudimos cargar la postulación." }, 500);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const denied = await authorizeAdmin();
    if (denied) return denied;
    if (!sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);
    const { id } = await context.params;
    if (!validId(id)) return json({ error: "Identificador inválido." }, 400);
    const raw = await request.text();
    if (raw.length > 200) return json({ error: "Solicitud inválida." }, 400);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: "Solicitud inválida." }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).length !== 1 || !["EN_REVISION", "DESCARTADA"].includes(body.estado)) {
      return json({ error: "Estado inválido." }, 400);
    }
    const updated = await prisma.postulacionTalento.updateMany({
      where: { AND: [confirmedWhere, { id }] }, data: { estado: body.estado },
    });
    return updated.count ? json({ estado: body.estado }) : json({ error: "Postulación no encontrada." }, 404);
  } catch {
    return json({ error: "No pudimos guardar el estado. Intenta nuevamente." }, 500);
  }
}
