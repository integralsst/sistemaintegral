import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el artículo" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: body,
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("Error updating post:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "El slug ya está en uso." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar el artículo" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Artículo eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el artículo" }, { status: 500 });
  }
}