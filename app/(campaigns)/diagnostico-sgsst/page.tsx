import type { Metadata } from "next";

import SgsstComplianceLanding from "./_components/SgsstComplianceLanding";

export const metadata: Metadata = {
  title: "Diagnóstico SG-SST para empresas | SIS",
  description:
    "Identifique brechas críticas del SG-SST, conozca la exposición de su empresa y reciba una ruta inicial de intervención.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "¿Su empresa está preparada para una visita del Ministerio?",
    description:
      "Descubra en pocos minutos si existen brechas críticas en el SG-SST de su empresa.",
    type: "website",
    locale: "es_CO",
    siteName: "SIS Riesgos Laborales",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnóstico de exposición SG-SST | SIS",
    description:
      "Evalúe rápidamente las principales señales de incumplimiento del SG-SST.",
  },
};

export default function DiagnosticoSgsstPage() {
  return <SgsstComplianceLanding />;
}
