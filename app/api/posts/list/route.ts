import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        category: true,
        readTime: true,
        createdAt: true,
        isFeatured: true,
        // Omitimos 'content' intencionalmente para que el payload sea ligero y cargue rápido
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Error al obtener los artículos" }, { status: 500 });
  }
}