import type { EstadoPostulacion, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, confirmedWhere, json, summarySelect } from "@/lib/postulaciones-admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const denied = await authorizeAdmin();
    if (denied) return denied;
    const params = new URL(request.url).searchParams;
    const allowed = ["q", "estado", "ciudad", "page", "pageSize"];
    if ([...params.keys()].some(key => !allowed.includes(key) || params.getAll(key).length !== 1)) {
      return json({ error: "Filtros inválidos." }, 400);
    }
    const q = (params.get("q") ?? "").trim();
    const ciudad = (params.get("ciudad") ?? "").trim();
    const estado = params.get("estado") ?? "";
    const pageValue = params.get("page") ?? "1";
    const sizeValue = params.get("pageSize") ?? "20";
    if (q.length > 120 || ciudad.length > 120 || /[\x00-\x1f]/.test(q + ciudad) ||
      (estado && !["RECIBIDA", "EN_REVISION", "DESCARTADA"].includes(estado)) ||
      !/^[1-9]\d{0,5}$/.test(pageValue) || !/^(10|20|50)$/.test(sizeValue)) {
      return json({ error: "Revisa los filtros y la paginación." }, 400);
    }
    const page = Number(pageValue);
    const pageSize = Number(sizeValue);
    const filters: Prisma.PostulacionTalentoWhereInput = {
      ...(estado ? { estado: estado as EstadoPostulacion } : {}),
      ...(ciudad ? { ciudad } : {}),
      ...(q ? { OR: ["nombreCompleto", "correo", "profesion"].map(field => ({ [field]: { contains: q } })) } : {}),
    };
    const where = { AND: [confirmedWhere, filters] };
    const [total, items, received, reviewing, discarded, cities] = await prisma.$transaction([
      prisma.postulacionTalento.count({ where }),
      prisma.postulacionTalento.findMany({ where, select: summarySelect,
        orderBy: [{ creadoEn: "desc" }, { id: "desc" }], skip: (page - 1) * pageSize, take: pageSize }),
      prisma.postulacionTalento.count({ where: { AND: [confirmedWhere, { estado: "RECIBIDA" }] } }),
      prisma.postulacionTalento.count({ where: { AND: [confirmedWhere, { estado: "EN_REVISION" }] } }),
      prisma.postulacionTalento.count({ where: { AND: [confirmedWhere, { estado: "DESCARTADA" }] } }),
      prisma.postulacionTalento.groupBy({ by: ["ciudad"], where: confirmedWhere, orderBy: { ciudad: "asc" } }),
    ]);
    const stats = { total: received + reviewing + discarded, RECIBIDA: received, EN_REVISION: reviewing, DESCARTADA: discarded };
    return json({ items, total, page, pageSize, stats, cities: cities.map(row => row.ciudad) });
  } catch {
    // Never log Prisma errors containing personal data or signed URLs.
    return json({ error: "No pudimos consultar las postulaciones. Intenta nuevamente." }, 500);
  }
}
