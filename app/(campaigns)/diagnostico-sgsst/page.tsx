import type { Metadata } from "next";
import SgsstComplianceLanding from "./_components/SgsstComplianceLanding";

export const metadata: Metadata = {
  title: "Multas y cierre por SG-SST | Diagnóstico gratuito SIS",
  description:
    "Descubra en 60 segundos si su empresa tiene brechas críticas del SG-SST y conozca la prioridad de intervención.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "¿Su empresa podría demostrar hoy el cumplimiento del SG-SST?",
    description:
      "Diagnóstico rápido para identificar señales de exposición antes de una visita, una denuncia o un accidente.",
    type: "website",
    locale: "es_CO",
    siteName: "SIS Riesgos Laborales",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnóstico de exposición SG-SST | SIS",
    description:
      "Cinco preguntas para detectar brechas críticas y definir el siguiente paso.",
  },
};

export default function DiagnosticoSgsstPage() {
  return <SgsstComplianceLanding />;
}
