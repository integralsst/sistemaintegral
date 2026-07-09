import type { Metadata } from "next";
// Importamos Plus Jakarta Sans, la reina del diseño geométrico actual
import { Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";

// Configuramos la nueva tipografía
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"], // Nos aseguramos de traer todos los grosores
});

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
      {/* Inyectamos la clase de Jakarta */}
      <body className={`antialiased bg-white ${jakarta.className}`}>
        {children}
      </body>
    </html>
  );
}