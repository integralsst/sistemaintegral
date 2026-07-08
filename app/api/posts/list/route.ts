import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Ajusta la ruta a tu instancia de Prisma

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        // No traemos el content aquí para que la tabla cargue muy rápido
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Error al obtener los artículos" }, { status: 500 });
  }
}