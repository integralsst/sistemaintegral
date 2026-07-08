import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Artículo eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el artículo" }, { status: 500 });
  }
}