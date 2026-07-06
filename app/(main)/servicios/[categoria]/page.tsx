import { notFound } from "next/navigation";
import { servicesData } from "@/app/lib/data/services";
import DetalleServicioLayout from "@/app/components/main/servicios/DetalleServicioLayout"

interface PageProps {
  params: Promise<{
    categoria: string;
  }>;
}

export default async function ServicioDynamicPage({ params }: PageProps) {
  // 1. Forzamos la resolución asíncrona de los parámetros de Next.js
  const resolvedParams = await params;
  const categoria = resolvedParams.categoria;

  // 2. Buscamos la información en la fuente de datos
  const serviceInfo = servicesData[categoria];

  // 3. Manejo estricto de rutas inexistentes (Error 404)
  if (!serviceInfo) {
    notFound();
  }

  // 4. Renderizado del diseño inyectando los datos validados
  return <DetalleServicioLayout data={serviceInfo} />;
}