import type { Metadata } from "next";
import TalentoLanding from "./_components/TalentoLanding";

export const metadata: Metadata = {
  title: "Conecta tu talento con SIS | Postulaciones",
  description:
    "Comparte tu perfil profesional y hoja de vida con SIS Riesgos Laborales para futuras oportunidades de colaboración.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "Conecta tu talento con SIS",
    description: "Queremos conocer tu experiencia. Déjanos tus datos y tu hoja de vida.",
    siteName: "SIS Riesgos Laborales",
    locale: "es_CO",
    type: "website",
  },
};

export default function TalentoSisPage() {
  return <TalentoLanding />;
}
