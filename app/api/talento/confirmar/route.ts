import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CV_MAX_BYTES, hashToken, readCloudinaryAsset } from "@/lib/talento";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 2000) {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }
    const record = body as Record<string, unknown>;
    const id = typeof record.applicationId === "string" ? record.applicationId : "";
    const token = typeof record.confirmationToken === "string" ? record.confirmationToken : "";

    // Admitimos UUID nuevos y CUID de intentos creados antes de la corrección.
    // El token secreto sigue siendo obligatorio y se comprueba contra su hash.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    const isCuid = /^c[a-z0-9]{24}$/.test(id);
    if ((!isUuid && !isCuid) || !/^[0-9a-f]{64}$/.test(token)) {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }

    const application = await prisma.postulacionTalento.findUnique({
      where: { id },
      select: {
        estado: true,
        tokenHash: true,
        tokenExpiraEn: true,
        hojaVidaPublicId: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Postulación no encontrada." }, { status: 404 });
    }

    const expected = Buffer.from(application.tokenHash, "hex");
    const supplied = Buffer.from(hashToken(token), "hex");
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 403 });
    }
    if (application.estado === "RECIBIDA" || application.estado === "EN_REVISION") {
      return NextResponse.json({ ok: true, applicationId: id });
    }
    if (application.estado !== "PENDIENTE" || application.tokenExpiraEn < new Date()) {
      return NextResponse.json({ error: "La sesión venció. Vuelve a intentar." }, { status: 410 });
    }

    // No confiamos en el public_id, tamaño o tipo declarados por el navegador.
    // Cloudinary confirma que el archivo privado realmente existe.
    const asset = await readCloudinaryAsset(application.hojaVidaPublicId);
    if (
      !asset ||
      asset.publicId !== application.hojaVidaPublicId ||
      asset.resourceType !== "raw" ||
      asset.type !== "authenticated" ||
      !asset.publicId.toLowerCase().endsWith(".pdf") ||
      (asset.format !== undefined && asset.format !== null && asset.format !== "pdf") ||
      asset.bytes < 100 ||
      asset.bytes > CV_MAX_BYTES ||
      !asset.assetId
    ) {
      return NextResponse.json(
        { error: "No se pudo verificar el PDF. Intenta subirlo de nuevo." },
        { status: 422 }
      );
    }

    const updated = await prisma.postulacionTalento.updateMany({
      where: { id, estado: "PENDIENTE", tokenExpiraEn: { gt: new Date() } },
      data: {
        estado: "RECIBIDA",
        hojaVidaAssetId: asset.assetId,
        hojaVidaBytes: asset.bytes,
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json({ error: "La postulación no pudo confirmarse." }, { status: 409 });
    }

    return NextResponse.json(
      { ok: true, applicationId: id },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("No se pudo confirmar postulación:", error);
    return NextResponse.json(
      { error: "No pudimos confirmar la postulación. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
