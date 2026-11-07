import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, confirmedWhere, json, privateHeaders, sameOrigin, temporaryPdfUrl, validId } from "@/lib/postulaciones-admin";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

async function access(request: Request, context: Context, redirect: boolean) {
  try {
    const denied = await authorizeAdmin();
    if (denied) return denied;
    if (!redirect && !sameOrigin(request)) return json({ error: "Origen no permitido." }, 403);
    const { id } = await context.params;
    const params = new URL(request.url).searchParams;
    const mode = params.get("mode") ?? "inline";
    if (!validId(id) || !["inline", "download"].includes(mode) ||
      [...params.keys()].some(key => key !== "mode" || params.getAll(key).length !== 1)) {
      return json({ error: "Solicitud de documento inválida." }, 400);
    }
    const item = await prisma.postulacionTalento.findFirst({
      where: { AND: [confirmedWhere, { id }] }, select: { hojaVidaPublicId: true },
    });
    if (!item) return json({ error: "Documento no disponible." }, 404);
    const signed = temporaryPdfUrl(item.hojaVidaPublicId, mode === "download");
    // Only the browser transfers the PDF: no Vercel 4.5 MB response limit.
    return redirect
      ? new NextResponse(null, { status: 303, headers: { ...privateHeaders, Location: signed.url } })
      : json(signed);
  } catch {
    return json({ error: "No pudimos autorizar el documento. Intenta nuevamente." }, 500);
  }
}

export async function POST(request: Request, context: Context) { return access(request, context, false); }
export async function GET(request: Request, context: Context) { return access(request, context, true); }
