// lib/data/services.ts

export interface ServiceCategory {
  id: string; 
  title: string;
  description: string;
  items: string[];
  bannerImage: string;   // Nueva propiedad para el banner horizontal
  verticalImage: string; // Nueva propiedad para la imagen lateral
}

export const servicesData: Record<string, ServiceCategory> = {
  "gestion-documental": {
    id: "gestion-documental",
    title: "Gestión Documental",
    description: "Estructuración normativa, diseño de políticas, reglamentos y consolidación del SG-SST alineado a la legislación vigente.",
    items: [
      "Diseño y actualización del SG-SST",
      "Creación de políticas y reglamentos",
      "Elaboración de matrices de peligros e identificación de requisitos legales",
      "Diseño de planes de emergencia"
    ],
    // Asegúrate de que los nombres coincidan con los archivos en tu carpeta public/images/
    bannerImage: "/images/banner-documental.png", 
    verticalImage: "/images/vertical-documental.webp"
  },
  "gestion-a-la-intervencion": {
    id: "gestion-a-la-intervencion",
    title: "Gestión de la Intervención",
    description: "Ejecución de inspecciones, controles operativos locativos y evaluación continua de riesgos en el entorno de trabajo.",
    items: [
      "Inspecciones de seguridad y salud en el trabajo",
      "Investigación de accidentes e incidentes de trabajo",
      "Evaluación de puestos de trabajo",
      "Seguimiento a las recomendaciones médicas"
    ],
    bannerImage: "/images/banner-intervencion.webp",
    verticalImage: "/images/vertical-intervencion.webp"
  },
  "gestion-a-emergencias": {
    id: "gestion-a-emergencias",
    title: "Gestión de Emergencias",
    description: "Preparación táctica mediante formación de brigadas, planes de evacuación, simulacros y manejo de contingencias.",
    items: [
      "Formación a brigadas de emergencia",
      "Simulacros de evacuación y rescate",
      "Inspección de equipos de emergencia (extintores, botiquines, etc.)",
      "Elaboración de planes de contingencia"
    ],
    bannerImage: "/images/banner-emergencias.webp",
    verticalImage: "/images/vertical-emergencias.webp"
  },
  "gestion-especializada": {
    id: "gestion-especializada",
    title: "Gestión Especializada",
    description: "La Gestión especializada se fundamenta en la prestación de servicios técnicos y estratégicos por parte de profesionales interdisciplinarios, especialistas en seguridad y salud en el trabajo, orientados a brindar soluciones de alto valor.",
    items: [
      "Soporte técnico calificado para la toma de decisiones empresariales",
      "Servicios estratégicos y operativos para Administradoras de Riesgos Laborales (ARL)",
      "Fortalecimiento integral y auditoría de los sistemas de gestión",
      "Intervención especializada con equipos profesionales interdisciplinarios"
    ],
    bannerImage: "/images/banner-especializada.webp",
    verticalImage: "/images/vertical-especializada.webp"
  }
};