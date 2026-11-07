import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CV_MAX_BYTES, cloudinaryConfig, signCloudinary } from "@/lib/talento";

export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  Vary: "Cookie",
};

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: privateHeaders });
}

export async function authorizeAdmin() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return json({ error: "Inicia sesión para continuar." }, 401);
  let session;
  try {
    session = await verifySessionToken(token);
  } catch {
    return json({ error: "Tu sesión venció. Inicia sesión nuevamente." }, 401);
  }
  if (session.role !== "ADMIN" || typeof session.userId !== "string") {
    return json({ error: "Acceso exclusivo para administradores." }, 403);
  }
  // Recheck role/activation so revoked access does not survive a valid JWT.
  const user = await prisma.user.findUnique({
    where: { id: session.userId }, select: { role: true, isActive: true },
  });
  if (!user?.isActive || user.role !== "ADMIN") {
    return json({ error: "Acceso exclusivo para administradores." }, 403);
  }
  return null;
}

export function sameOrigin(request: Request) {
  const expected = new URL(request.url);
  // Next can normalize the internal URL to localhost. Host is the origin the
  // browser actually addressed and cannot be overridden by cross-site JS.
  expected.host = request.headers.get("host") ?? expected.host;
  return request.headers.get("origin") === expected.origin;
}

export function validId(id: string) {
  return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|c[a-z0-9]{24})$/.test(id);
}

export const confirmedWhere: Prisma.PostulacionTalentoWhereInput = {
  estado: { in: ["RECIBIDA", "EN_REVISION", "DESCARTADA"] },
  hojaVidaAssetId: { not: null },
  NOT: [{ hojaVidaAssetId: "" }, { hojaVidaPublicId: "" }],
  hojaVidaBytes: { gte: 100, lte: CV_MAX_BYTES },
};

export const summarySelect = {
  id: true, nombreCompleto: true, correo: true, ciudad: true,
  profesion: true, estado: true, creadoEn: true,
} satisfies Prisma.PostulacionTalentoSelect;

export const detailSelect = {
  ...summarySelect, telefono: true, aniosExperiencia: true, modalidad: true,
  mensaje: true, hojaVidaNombre: true, utmSource: true, utmMedium: true,
  utmCampaign: true, utmContent: true,
} satisfies Prisma.PostulacionTalentoSelect;

// REST equivalent of Cloudinary utils.private_download_url. For RAW, the full
// Keep the original raw public_id including .pdf; format is required by Cloudinary private_download_url.
// A regular signed res.cloudinary.com delivery URL would NOT expire.
// https://cloudinary.com/documentation/control_access_to_media
export function temporaryPdfUrl(publicId: string, download: boolean, now = Date.now()) {
  if (!publicId.toLowerCase().endsWith(".pdf")) throw new Error("Invalid PDF");
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const timestamp = Math.floor(now / 1000);
  const expiresAt = timestamp + 120;
  const parameters = {
    public_id: publicId, format: "pdf", type: "authenticated", timestamp: String(timestamp),
    expires_at: String(expiresAt), attachment: String(download),
  };
  const query = new URLSearchParams({
    ...parameters, api_key: apiKey, signature: signCloudinary(parameters, apiSecret),
  });
  return { url: `https://api.cloudinary.com/v1_1/${cloudName}/raw/download?${query}`, expiresAt };
}
