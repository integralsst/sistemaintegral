// app/api/auth/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const session = await verifySessionToken(token);

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.email,
        role: session.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}