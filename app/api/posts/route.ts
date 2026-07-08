import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, readTime, image, isFeatured } = body;

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category, // Viene como JSON stringificado desde tu frontend
        readTime,
        image,
        isFeatured,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    // Manejo de error si el slug ya existe
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "El slug ya está en uso." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear el artículo" }, { status: 500 });
  }
}