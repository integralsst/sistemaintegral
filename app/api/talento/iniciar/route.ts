import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  cloudinaryConfig,
  hashToken,
  newToken,
  parseCandidate,
  signCloudinary,
  UPLOAD_EXPIRY_MINUTES,
} from "@/lib/talento";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 10000) {
      return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });
    }
    const body: unknown = JSON.parse(raw);
    if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
      return NextResponse.json({ error: "No se pudo registrar la solicitud." }, { status: 400 });
    }
    const data = parseCandidate(body);
    if (!data) {
      return NextResponse.json({ error: "Revisa los datos y la autorización de tratamiento." }, { status: 400 });
    }

    const config = cloudinaryConfig();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    const ipHash = ip
      ? createHmac("sha256", config.apiSecret).update(ip).digest("hex")
      : null;

    // Límite por IP, sin almacenar la dirección IP en claro.
    if (ipHash) {
      const since = new Date(Date.now() - 60 * 60 * 1000);
      const count = await prisma.postulacionTalento.count({
        where: { ipHash, creadoEn: { gte: since } },
      });
      if (count >= 5) {
        return NextResponse.json({ error: "Demasiados intentos. Intenta más tarde." }, { status: 429 });
      }
    }

    const id = randomUUID();
    const publicId = `talento-sis/${id}.pdf`;
    const token = newToken();
    const expires = new Date(Date.now() + UPLOAD_EXPIRY_MINUTES * 60 * 1000);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const parameters = {
      allowed_formats: "pdf",
      overwrite: "false",
      public_id: publicId,
      timestamp,
      type: "authenticated",
    };

    const application = await prisma.postulacionTalento.create({
      data: {
        nombreCompleto: data.fullName,
        correo: data.email,
        telefono: data.phone,
        ciudad: data.city,
        profesion: data.profession,
        aniosExperiencia: data.experienceYears,
        modalidad: data.availability,
        mensaje: data.message,
        hojaVidaNombre: data.cvFileName,
        hojaVidaPublicId: publicId,
        tokenHash: hashToken(token),
        tokenExpiraEn: expires,
        consentimientoEn: new Date(),
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        ipHash,
      },
      select: { id: true },
    });

    return NextResponse.json({
      applicationId: application.id,
      confirmationToken: token,
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      uploadParameters: parameters,
      signature: signCloudinary(parameters, config.apiSecret),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "Cloudinary no está configurado correctamente") {
      // No divulgar nombres de variables ni credenciales en respuestas públicas.
      console.error("No se pudo iniciar postulación: falta configurar Cloudinary en el entorno.");
      return NextResponse.json(
        { error: "El servicio de recepción de hojas de vida no está disponible temporalmente." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }
    console.error("No se pudo iniciar postulación:", error);
    return NextResponse.json(
      { error: "No pudimos iniciar tu postulación. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
