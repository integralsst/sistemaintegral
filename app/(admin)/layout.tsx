import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    const session = await verifySessionToken(token);

    if (session.role !== "ADMIN") {
      redirect("/");
    }

    return <>{children}</>;
  } catch {
    redirect("/");
  }
}