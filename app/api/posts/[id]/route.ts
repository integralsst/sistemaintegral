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
    
    // Aquí está la magia: Extraemos SOLAMENTE los campos que existen en la base de datos
    // Esto ignora el arreglo "tags" que manda el frontend y evita que Prisma colapse.
    const { title, slug, excerpt, content, category, readTime, image, isFeatured } = body;
    
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        readTime,
        image,
        isFeatured
      },
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