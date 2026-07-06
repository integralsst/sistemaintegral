import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIS | Sistema Integral en Riesgos Laborales",
  description: "Servicios técnicos y estratégicos en Seguridad y Salud en el Trabajo (SG-SST). Gestión documental, a la intervención, a emergencias y especializada para ARL y empresas en general.",
  keywords: [
    "SST", 
    "riesgos laborales", 
    "SG-SST", 
    "salud ocupacional", 
    "Colombia", 
    "ARL", 
    "seguridad industrial",
    "gestión especializada"
  ],
  openGraph: {
    title: "SIS | Sistema Integral en Riesgos Laborales",
    description: "Cumplimiento Legal. Sin Complicaciones.",
    url: "https://tudominio.com", 
    siteName: "SIS Riesgos Laborales",
    locale: "es_CO",
    type: "website",
  },
  // Inyección de fuerza bruta apuntando a la carpeta public
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: ['/favicon.png'],
    apple: [
      { url: '/favicon.png', type: 'image/png' }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}