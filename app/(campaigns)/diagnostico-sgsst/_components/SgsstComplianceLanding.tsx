"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FileSearch,
  Fingerprint,
  Gauge,
  HardHat,
  LockKeyhole,
  MessageCircle,
  Radar,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";

/**
 * CAMBIA ESTE NÚMERO por el WhatsApp comercial de SIS.
 * Formato: indicativo de país + número, sin +, espacios ni guiones.
 * Ejemplo Colombia: 573001234567
 */
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_SIS_WHATSAPP ?? "573001234567";

const OFFICIAL_SOURCES = {
  sanctions:
    "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30045161",
  closure:
    "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=51147",
  closureDecree:
    "https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=61117",
  uvt: "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0238_2025.htm",
};

type RiskLevel = "critical" | "high" | "medium" | "controlled";

type QuizQuestion = {
  id: string;
  question: string;
  help: string;
  options: Array<{
    label: string;
    points: number;
  }>;
};

type LeadForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  workers: string;
};

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const quizQuestions: QuizQuestion[] = [
  {
    id: "evidence",
    question: "¿Podría mostrar hoy evidencias completas y actualizadas del SG-SST?",
    help: "No solo documentos: también firmas, fechas, responsables, seguimiento y ejecución.",
    options: [
      { label: "Sí, todo está actualizado", points: 0 },
      { label: "Tenemos documentos, pero faltan evidencias", points: 2 },
      { label: "No estamos seguros", points: 3 },
      { label: "No", points: 4 },
    ],
  },
  {
    id: "standards",
    question: "¿La evaluación de Estándares Mínimos está al día y tiene plan de mejora?",
    help: "La evaluación sin seguimiento deja hallazgos abiertos y aumenta la exposición.",
    options: [
      { label: "Sí, con seguimiento verificable", points: 0 },
      { label: "Está hecha, pero desactualizada", points: 2 },
      { label: "Solo tenemos una calificación", points: 3 },
      { label: "No se ha realizado", points: 4 },
    ],
  },
  {
    id: "committees",
    question: "¿COPASST o Vigía, CCL y brigada funcionan con actas y compromisos cerrados?",
    help: "Reunirse no basta: deben existir soportes, seguimiento y cierre de acciones.",
    options: [
      { label: "Sí, todo está trazado", points: 0 },
      { label: "Hay actas, pero faltan firmas o seguimiento", points: 2 },
      { label: "Funcionan de manera irregular", points: 3 },
      { label: "No están conformados o activos", points: 4 },
    ],
  },
  {
    id: "incidents",
    question: "¿Accidentes e incidentes se investigan dentro del plazo y con acciones eficaces?",
    help: "Una investigación incompleta puede dejar expuestas las causas y la responsabilidad empresarial.",
    options: [
      { label: "Sí, con seguimiento a controles", points: 0 },
      { label: "Se investigan, pero tarde", points: 2 },
      { label: "No siempre se cierran las acciones", points: 3 },
      { label: "No tenemos un proceso claro", points: 4 },
    ],
  },
  {
    id: "contractors",
    question: "¿Controla requisitos de SST de contratistas, proveedores y personal externo?",
    help: "La tercerización no elimina la exposición cuando el riesgo entra a su operación.",
    options: [
      { label: "Sí, antes y durante el servicio", points: 0 },
      { label: "Solo pedimos algunos documentos", points: 2 },
      { label: "El control es informal", points: 3 },
      { label: "No los controlamos", points: 4 },
    ],
  },
  {
    id: "emergency",
    question: "¿El plan de emergencias está probado y responde a la realidad de la sede?",
    help: "Un documento genérico no reemplaza recursos, simulacros, brigada y capacidad de respuesta.",
    options: [
      { label: "Sí, se prueba y mejora", points: 0 },
      { label: "Existe, pero no se ha probado recientemente", points: 2 },
      { label: "Está incompleto o desactualizado", points: 3 },
      { label: "No existe", points: 4 },
    ],
  },
];

const painCards = [
  {
    icon: CircleDollarSign,
    kicker: "Sanción económica",
    title: "Hasta 26.313,02 UVT",
    description:
      "El máximo legal puede superar los $1,37 mil millones en valores de 2026, según el tipo de incumplimiento y el tamaño de la empresa.",
    accent: "from-rose-500/30 via-rose-500/5 to-transparent",
  },
  {
    icon: LockKeyhole,
    kicker: "Operación detenida",
    title: "Cierre de 3 a 10 días",
    description:
      "Ante condiciones que pongan en peligro la vida, integridad o seguridad de los trabajadores, el lugar de trabajo puede ser clausurado.",
    accent: "from-amber-500/30 via-amber-500/5 to-transparent",
  },
  {
    icon: Siren,
    kicker: "Reincidencia",
    title: "Hasta 120 días o cierre definitivo",
    description:
      "Cuando persisten los hechos o existe reincidencia, la medida puede escalar y comprometer la continuidad del negocio.",
    accent: "from-red-600/35 via-red-500/5 to-transparent",
  },
];

const exposurePoints = [
  {
    icon: FileSearch,
    title: "Documentos sin evidencia real",
    text: "Formatos copiados, programas sin ejecución, firmas pendientes y soportes dispersos no demuestran gestión.",
  },
  {
    icon: Clock3,
    title: "Obligaciones vencidas",
    text: "Capacitaciones, inspecciones, evaluaciones médicas, mantenimientos y planes sin actualización dejan brechas visibles.",
  },
  {
    icon: ShieldAlert,
    title: "Accidentes mal investigados",
    text: "Causas superficiales y acciones sin cierre permiten que el evento se repita y elevan la exposición jurídica.",
  },
  {
    icon: Users,
    title: "Comités que existen solo en papel",
    text: "COPASST, Vigía y CCL sin reuniones efectivas, firmas o seguimiento pueden convertirse en hallazgos evitables.",
  },
  {
    icon: HardHat,
    title: "Contratistas fuera de control",
    text: "Personal externo sin validación documental ni control operativo puede introducir riesgos críticos a la empresa.",
  },
  {
    icon: Radar,
    title: "Nadie ve el riesgo completo",
    text: "Archivos aislados y tareas sin trazabilidad impiden saber qué está cumplido, vencido o nunca revisado.",
  },
];

const deliveryItems = [
  "Diagnóstico de exposición por prioridades",
  "Identificación de brechas críticas y evidencias faltantes",
  "Ruta de trabajo priorizada por impacto y urgencia",
  "Acompañamiento de profesionales con licencia en SST",
  "Seguimiento documental y de intervención en campo",
  "Preparación para visitas, auditorías y requerimientos",
];

const faqItems = [
  {
    question: "¿La multa máxima aplica automáticamente?",
    answer:
      "No. La autoridad gradúa la sanción según el tamaño de la empresa, la gravedad, la reincidencia, la conducta y otros criterios. La landing muestra topes legales para dimensionar la exposición, no una sanción automática.",
  },
  {
    question: "¿Tener los documentos significa que ya cumplimos?",
    answer:
      "No necesariamente. El SG-SST exige implementación, evidencias, seguimiento y mejora. Un documento sin ejecución verificable puede no demostrar cumplimiento.",
  },
  {
    question: "¿SIS atiende empresas fuera de Pereira?",
    answer:
      "SIS acompaña organizaciones en el Eje Cafetero y Norte del Valle con un equipo multidisciplinario de profesionales con licencia en SST.",
  },
  {
    question: "¿El diagnóstico genera una sanción o reporte a una entidad?",
    answer:
      "No. Es una valoración comercial inicial y confidencial para identificar señales de exposición y definir el siguiente paso.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function trackEvent(event: string, data: Record<string, unknown> = {}) {
  const win = window as DataLayerWindow;

  win.dataLayer?.push({ event, ...data });
  win.gtag?.("event", event, data);

  const metaEventMap: Record<string, string> = {
    cta_click: "Contact",
    quiz_complete: "CompleteRegistration",
    lead_submit: "Lead",
  };

  const metaEvent = metaEventMap[event];
  if (metaEvent) {
    win.fbq?.("track", metaEvent, data);
  } else {
    win.fbq?.("trackCustom", event, data);
  }
}

function getRisk(score: number): {
  level: RiskLevel;
  label: string;
  headline: string;
  description: string;
  className: string;
  progress: number;
} {
  if (score >= 18) {
    return {
      level: "critical",
      label: "Exposición crítica",
      headline: "Su empresa tiene señales que requieren intervención inmediata.",
      description:
        "Las brechas reportadas pueden afectar la capacidad de demostrar cumplimiento y responder ante una visita, accidente o requerimiento.",
      className: "border-red-500/50 bg-red-500/10 text-red-100",
      progress: 96,
    };
  }

  if (score >= 12) {
    return {
      level: "high",
      label: "Exposición alta",
      headline: "Hay brechas importantes que no conviene seguir aplazando.",
      description:
        "La empresa necesita priorizar evidencias, responsables y cierres antes de que un evento externo revele las fallas.",
      className: "border-orange-500/50 bg-orange-500/10 text-orange-100",
      progress: 76,
    };
  }

  if (score >= 6) {
    return {
      level: "medium",
      label: "Exposición media",
      headline: "Existe una base, pero todavía hay puntos vulnerables.",
      description:
        "Una revisión estructurada puede cerrar brechas y convertir documentos aislados en un sistema demostrable.",
      className: "border-amber-400/50 bg-amber-400/10 text-amber-50",
      progress: 52,
    };
  }

  return {
    level: "controlled",
    label: "Exposición controlada",
    headline: "Su empresa reporta buenas bases de gestión.",
    description:
      "Aun así, conviene verificar vigencias, trazabilidad y evidencias para evitar puntos ciegos.",
    className: "border-emerald-400/50 bg-emerald-400/10 text-emerald-50",
    progress: 24,
  };
}

function scrollToSection(id: string, source: string) {
  trackEvent("cta_click", { source });
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function AmbientBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030506]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(244,63,94,0.10),transparent_25%),radial-gradient(circle_at_15%_70%,rgba(16,185,129,0.08),transparent_25%)]" />
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 60, -20, 0],
                y: [0, -30, 30, 0],
                scale: [1, 1.08, 0.96, 1],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]"
      />
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -50, 30, 0],
                y: [0, 40, -20, 0],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-28 top-[38%] h-80 w-80 rounded-full bg-rose-500/10 blur-[120px]"
      />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(3,5,6,0.72)_65%,#030506)]" />
    </div>
  );
}

function RiskScanner() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[580px]">
      <div className="absolute inset-[8%] rounded-full bg-cyan-400/10 blur-3xl" />

      <svg
        viewBox="0 0 560 560"
        role="img"
        aria-label="Escáner animado de riesgos del SG-SST"
        className="relative h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="scanner-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#34d399" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="scanner-core">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#030506" stopOpacity="0" />
          </radialGradient>
          <filter id="scanner-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="280" cy="280" r="245" fill="url(#scanner-core)" />
        {[225, 178, 132, 86].map((radius, index) => (
          <motion.circle
            key={radius}
            cx="280"
            cy="280"
            r={radius}
            fill="none"
            stroke={index === 0 ? "url(#scanner-ring)" : "rgba(148,163,184,0.22)"}
            strokeWidth={index === 0 ? 1.5 : 1}
            strokeDasharray={index === 0 ? "8 12" : "4 14"}
            animate={
              reduceMotion
                ? undefined
                : { rotate: index % 2 === 0 ? 360 : -360 }
            }
            transition={{
              duration: 18 + index * 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "280px 280px" }}
          />
        ))}

        <motion.path
          d="M280 280 L280 70 A210 210 0 0 1 458 169 Z"
          fill="rgba(34,211,238,0.08)"
          stroke="rgba(34,211,238,0.26)"
          strokeWidth="1"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "280px 280px" }}
        />

        <motion.circle
          cx="280"
          cy="280"
          r="58"
          fill="#071015"
          stroke="url(#scanner-ring)"
          strokeWidth="2"
          filter="url(#scanner-glow)"
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "280px 280px" }}
        />

        <path
          d="M280 245 312 258v24c0 25-14 45-32 53-18-8-32-28-32-53v-24l32-13Z"
          fill="none"
          stroke="#ecfeff"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="m267 281 10 10 18-22"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {[
          { x: 126, y: 164, color: "#f43f5e", delay: 0 },
          { x: 444, y: 214, color: "#f59e0b", delay: 0.7 },
          { x: 160, y: 408, color: "#22d3ee", delay: 1.4 },
          { x: 392, y: 398, color: "#34d399", delay: 2.1 },
        ].map((point) => (
          <g key={`${point.x}-${point.y}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="18"
              fill={point.color}
              opacity="0.12"
              animate={
                reduceMotion ? undefined : { r: [14, 27, 14], opacity: [0.2, 0, 0.2] }
              }
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: point.delay,
                ease: "easeInOut",
              }}
            />
            <circle cx={point.x} cy={point.y} r="5" fill={point.color} />
          </g>
        ))}
      </svg>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute right-0 top-[17%] rounded-2xl border border-red-400/20 bg-black/55 px-4 py-3 shadow-2xl shadow-red-950/40 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
          <TriangleAlert className="h-3.5 w-3.5" />
          Riesgo detectado
        </div>
        <p className="mt-1 text-sm font-medium text-white">Evidencias incompletas</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-[15%] left-0 rounded-2xl border border-cyan-400/20 bg-black/55 px-4 py-3 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
          <Radar className="h-3.5 w-3.5" />
          Diagnóstico
        </div>
        <p className="mt-1 text-sm font-medium text-white">Prioridades en 60 segundos</p>
      </motion.div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-xl">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_16px_60px_rgba(255,255,255,0.14)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${className}`}
    >
      <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-200 transition-transform duration-300 group-hover:translate-y-0" />
      <span className="relative flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </motion.button>
  );
}

function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [lead, setLead] = useState<LeadForm>({
    name: "",
    company: "",
    phone: "",
    email: "",
    city: "",
    workers: "",
  });
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState("");

  const score = useMemo(
    () => Object.values(answers).reduce((total, value) => total + value, 0),
    [answers],
  );
  const risk = useMemo(() => getRisk(score), [score]);
  const progress = completed
    ? 100
    : ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  const handleAnswer = (points: number, optionLabel: string) => {
    const nextAnswers = { ...answers, [question.id]: points };
    setAnswers(nextAnswers);
    trackEvent("quiz_answer", {
      question: question.id,
      option: optionLabel,
      points,
    });

    if (currentQuestion === quizQuestions.length - 1) {
      const finalScore = Object.values(nextAnswers).reduce(
        (total, value) => total + value,
        0,
      );
      setCompleted(true);
      trackEvent("quiz_complete", {
        score: finalScore,
        risk_level: getRisk(finalScore).level,
      });
      return;
    }

    setCurrentQuestion((value) => value + 1);
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setCompleted(false);
    setFormError("");
  };

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!lead.name || !lead.company || !lead.phone || !lead.city) {
      setFormError("Completa nombre, empresa, teléfono y ciudad para continuar.");
      return;
    }

    if (!consent) {
      setFormError("Debes autorizar el contacto comercial para continuar.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const campaign = params.get("utm_campaign") ?? "directo";
    const source = params.get("utm_source") ?? "landing";
    const medium = params.get("utm_medium") ?? "web";

    const message = [
      "Hola, SIS. Quiero una revisión de exposición de mi SG-SST.",
      "",
      `Nombre: ${lead.name}`,
      `Empresa: ${lead.company}`,
      `Teléfono: ${lead.phone}`,
      `Correo: ${lead.email || "No informado"}`,
      `Ciudad: ${lead.city}`,
      `Número de trabajadores: ${lead.workers || "No informado"}`,
      `Resultado del diagnóstico: ${risk.label}`,
      `Puntaje: ${score}/${quizQuestions.length * 4}`,
      `Origen: ${source} / ${medium} / ${campaign}`,
    ].join("\n");

    trackEvent("lead_submit", {
      risk_level: risk.level,
      score,
      campaign,
      source,
      medium,
    });

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section id="diagnostico" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionLabel>Diagnóstico confidencial</SectionLabel>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Descubra qué tan expuesta está su empresa antes de que lo haga una visita.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Responda seis preguntas. Recibirá una clasificación inicial y podrá solicitar una revisión profesional.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div className="border-b border-white/10 px-5 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  {completed
                    ? "Resultado inicial"
                    : `Pregunta ${currentQuestion + 1} de ${quizQuestions.length}`}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  No solicita información sensible ni reporta datos a autoridades.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-2 text-xs font-medium text-emerald-200 sm:flex">
                <Fingerprint className="h-4 w-4" />
                Confidencial
              </div>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300"
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              />
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -22 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.08] sm:flex">
                      <Gauge className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                        {question.question}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                        {question.help}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {question.options.map((option, index) => (
                      <motion.button
                        key={option.label}
                        type="button"
                        onClick={() => handleAnswer(option.points, option.label)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.055] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        <span className="text-sm font-medium leading-5 text-slate-200 sm:text-base">
                          {option.label}
                        </span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-500 transition group-hover:border-cyan-300/40 group-hover:text-cyan-200">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {currentQuestion > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion((value) => value - 1)}
                      className="mt-6 text-sm font-medium text-slate-500 transition hover:text-slate-200"
                    >
                      Volver a la pregunta anterior
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
                    <div>
                      <div className={`rounded-3xl border p-6 ${risk.className}`}>
                        <div className="flex items-center gap-3">
                          <ShieldAlert className="h-6 w-6" />
                          <p className="text-xs font-bold uppercase tracking-[0.18em]">
                            {risk.label}
                          </p>
                        </div>
                        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                          {risk.headline}
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-current/80">
                          {risk.description}
                        </p>

                        <div className="mt-6">
                          <div className="flex items-center justify-between text-xs font-medium text-current/70">
                            <span>Nivel de señal</span>
                            <span>{score}/{quizQuestions.length * 4}</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${risk.progress}%` }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                              className="h-full rounded-full bg-current"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                        <p className="text-sm font-semibold text-white">
                          Esta valoración no reemplaza una auditoría.
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Es una señal inicial basada en sus respuestas. La revisión profesional valida documentos, evidencias y ejecución real.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={resetQuiz}
                        className="mt-5 text-sm font-medium text-slate-500 transition hover:text-white"
                      >
                        Repetir diagnóstico
                      </button>
                    </div>

                    <form onSubmit={submitLead} className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-7">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300 text-slate-950">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            Solicite una revisión prioritaria
                          </h3>
                          <p className="text-xs text-slate-500">
                            Abriremos WhatsApp con el resultado precargado.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {[
                          { key: "name", label: "Nombre", placeholder: "Su nombre", required: true },
                          { key: "company", label: "Empresa", placeholder: "Nombre de la empresa", required: true },
                          { key: "phone", label: "Teléfono", placeholder: "300 000 0000", required: true },
                          { key: "email", label: "Correo", placeholder: "correo@empresa.com", required: false },
                          { key: "city", label: "Ciudad", placeholder: "Pereira", required: true },
                          { key: "workers", label: "Trabajadores", placeholder: "Ej. 35", required: false },
                        ].map((field) => (
                          <label key={field.key} className="block">
                            <span className="mb-2 block text-xs font-medium text-slate-400">
                              {field.label}{field.required ? " *" : ""}
                            </span>
                            <input
                              type={field.key === "email" ? "email" : field.key === "phone" ? "tel" : "text"}
                              value={lead[field.key as keyof LeadForm]}
                              onChange={(event) =>
                                setLead((current) => ({
                                  ...current,
                                  [field.key]: event.target.value,
                                }))
                              }
                              placeholder={field.placeholder}
                              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:bg-cyan-300/[0.035] focus:ring-2 focus:ring-cyan-300/10"
                            />
                          </label>
                        ))}
                      </div>

                      <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-500">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => setConsent(event.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-cyan-400 focus:ring-cyan-300"
                        />
                        <span>
                          Autorizo a SIS para contactarme y tratar estos datos con fines comerciales relacionados con la solicitud.
                        </span>
                      </label>

                      {formError && (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs text-red-200">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                          {formError}
                        </div>
                      )}

                      <motion.button
                        type="submit"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_18px_60px_rgba(52,211,153,0.18)] transition hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                      >
                        Hablar con un especialista
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.55 }}
        >
          <SectionLabel>Preguntas claras</SectionLabel>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Sin letra pequeña. Sin falsas promesas.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
            Mostramos el riesgo con firmeza, pero la intervención debe partir de una revisión técnica y de evidencias reales.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-medium text-white">{item.question}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-6 text-sm leading-6 text-slate-400 sm:px-6">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function SgsstComplianceLanding() {
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030506] text-slate-200 selection:bg-cyan-300/25 selection:text-white">
      <AmbientBackground />
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-cyan-300 via-emerald-300 to-rose-400"
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#030506]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="group flex items-center gap-3" aria-label="SIS - Inicio">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 to-emerald-300/5 shadow-inner shadow-cyan-300/10">
              <ShieldCheck className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <div className="text-sm font-black tracking-[0.22em] text-white">SIS</div>
              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:block">
                Seguridad y Salud en el Trabajo
              </div>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#riesgos" className="text-sm text-slate-400 transition hover:text-white">
              Riesgos
            </a>
            <a href="#solucion" className="text-sm text-slate-400 transition hover:text-white">
              Solución
            </a>
            <button
              type="button"
              onClick={() => scrollToSection("diagnostico", "navbar")}
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.08]"
            >
              Diagnóstico gratuito
            </button>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("diagnostico", "navbar_mobile")}
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 md:hidden"
          >
            Evaluar empresa
          </button>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8 lg:pt-40">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-red-200">
                <Siren className="h-3.5 w-3.5" />
                El incumplimiento no avisa
              </div>

              <h1 className="mt-7 max-w-4xl text-balance text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.35rem]">
                Una visita puede revelar en horas lo que su empresa ha ignorado durante años.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                Multas, paralización de tareas, clausura y pérdida de continuidad. El problema no es tener una carpeta llamada SG-SST. Es no poder demostrar que el sistema funciona.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton onClick={() => scrollToSection("diagnostico", "hero_primary")}>
                  Medir mi exposición ahora
                </PrimaryButton>
                <button
                  type="button"
                  onClick={() => scrollToSection("riesgos", "hero_secondary")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  Ver consecuencias reales
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  60 segundos
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Confidencial
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Sin costo
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.12 }}
              className="relative"
            >
              <RiskScanner />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="mx-auto mt-14 grid max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:grid-cols-3"
          >
            {[
              {
                value: "26.313,02 UVT",
                label: "Tope sancionatorio en ciertos casos",
                icon: Scale,
              },
              {
                value: "≈ $1,38 mil millones",
                label: "Equivalencia aproximada con UVT 2026",
                icon: Banknote,
              },
              {
                value: "Cierre definitivo",
                label: "Puede ocurrir ante persistencia o reincidencia",
                icon: Building2,
              },
            ].map((item, index) => (
              <div
                key={item.value}
                className={`relative p-6 sm:p-7 ${index > 0 ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}
              >
                <item.icon className="h-5 w-5 text-cyan-200" />
                <p className="mt-4 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                  {item.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section id="riesgos" className="scroll-mt-24 border-y border-white/[0.06] bg-black/20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <SectionLabel>Consecuencias legales y operativas</SectionLabel>
              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Una multa duele. Una operación cerrada puede destruir el flujo de caja.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                El cierre no elimina la obligación con los trabajadores: los días de clausura pueden seguir contando para salarios, prestaciones y vacaciones.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {painCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-7"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-70 transition group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
                      <card.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {card.kicker}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {card.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] p-5 text-xs leading-5 text-amber-100/70 sm:flex sm:items-start sm:gap-3 sm:p-6">
              <AlertTriangle className="mb-3 h-5 w-5 shrink-0 text-amber-200 sm:mb-0" />
              <p>
                Los valores son topes legales y aproximaciones con la UVT 2026. La sanción concreta depende del tamaño de la empresa, la conducta, la gravedad, la reincidencia y el debido proceso administrativo.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                className="lg:sticky lg:top-28 lg:self-start"
              >
                <SectionLabel>Los huecos más peligrosos</SectionLabel>
                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                  El riesgo suele estar donde la empresa cree que “ya cumplió”.
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-400">
                  Una carpeta llena no garantiza trazabilidad. La autoridad, una auditoría o un accidente ponen a prueba la coherencia entre lo escrito y lo ejecutado.
                </p>
                <PrimaryButton
                  onClick={() => scrollToSection("diagnostico", "exposure_section")}
                  className="mt-8"
                >
                  Detectar mis brechas
                </PrimaryButton>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                {exposurePoints.map((item, index) => (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.035]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06]">
                      <item.icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <QuizSection />

        <section id="solucion" className="scroll-mt-24 border-y border-white/[0.06] bg-white/[0.018] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65 }}
              >
                <SectionLabel>De la exposición al control</SectionLabel>
                <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  No le entregamos más archivos. Le ayudamos a construir evidencia defendible.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                  SIS combina gestión documental, intervención en campo y seguimiento para que cada obligación tenga responsable, soporte y estado real.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {deliveryItems.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-slate-950">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                      <p className="text-sm leading-6 text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65 }}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-300/[0.09] via-white/[0.035] to-emerald-300/[0.07] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.35)] sm:p-8"
              >
                <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                        Capacidad SIS
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        Experiencia multidisciplinaria
                      </h3>
                    </div>
                    <BadgeCheck className="h-9 w-9 text-emerald-300" />
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {[
                      { value: "11+", label: "años" },
                      { value: "100+", label: "empresas" },
                      { value: "40+", label: "profesionales" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      "Seguridad y Salud en el Trabajo",
                      "Medicina preventiva y del trabajo",
                      "Psicología, fisioterapia e higiene industrial",
                      "Emergencias, tareas de alto riesgo e ingenierías",
                    ].map((line) => (
                      <div key={line} className="flex items-center gap-3 text-sm text-slate-300">
                        <Zap className="h-4 w-4 text-cyan-200" />
                        {line}
                      </div>
                    ))}
                  </div>

                  <PrimaryButton
                    onClick={() => scrollToSection("diagnostico", "solution_card")}
                    className="mt-8 w-full"
                  >
                    Solicitar evaluación
                  </PrimaryButton>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65 }}
              className="relative overflow-hidden rounded-[2rem] border border-red-400/15 bg-[radial-gradient(circle_at_80%_20%,rgba(244,63,94,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-6 shadow-[0_50px_140px_rgba(0,0,0,0.45)] sm:p-10 lg:p-14"
            >
              <div className="absolute -right-14 -top-20 text-red-400/[0.055]">
                <ShieldAlert className="h-72 w-72" strokeWidth={0.7} />
              </div>
              <div className="relative max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-200">
                  La pregunta incómoda
                </p>
                <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                  Si el Ministerio llegara mañana, ¿su empresa mostraría control o improvisación?
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                  Cada día de aplazamiento mantiene abiertas las mismas brechas. El diagnóstico toma un minuto. Corregir después de una sanción puede costar mucho más.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PrimaryButton onClick={() => scrollToSection("diagnostico", "final_cta")}>
                    Revisar mi exposición
                  </PrimaryButton>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, SIS. Quiero hablar con un especialista sobre el SG-SST de mi empresa.")}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("cta_click", { source: "final_whatsapp" })}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.08]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ir directo a WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Faq />
      </main>

      <footer className="border-t border-white/[0.07] px-4 pb-28 pt-10 sm:px-6 sm:pb-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 border-b border-white/[0.07] pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07]">
                  <ShieldCheck className="h-5 w-5 text-cyan-200" />
                </div>
                <div className="text-lg font-black tracking-[0.2em] text-white">SIS</div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Acompañamiento en Seguridad y Salud en el Trabajo para empresas del Eje Cafetero y Norte del Valle.
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection("diagnostico", "footer")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
            >
              Iniciar diagnóstico
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-5 pt-6 text-xs leading-5 text-slate-600 md:flex-row md:items-start md:justify-between">
            <p>© {new Date().getFullYear()} SIS S.A.S. Todos los derechos reservados.</p>
            <div className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2">
              <a href={OFFICIAL_SOURCES.sanctions} target="_blank" rel="noreferrer" className="transition hover:text-slate-300">
                Decreto 2642 de 2022
              </a>
              <a href={OFFICIAL_SOURCES.closure} target="_blank" rel="noreferrer" className="transition hover:text-slate-300">
                Ley 1610 de 2013
              </a>
              <a href={OFFICIAL_SOURCES.closureDecree} target="_blank" rel="noreferrer" className="transition hover:text-slate-300">
                Decreto 472 de 2015
              </a>
              <a href={OFFICIAL_SOURCES.uvt} target="_blank" rel="noreferrer" className="transition hover:text-slate-300">
                UVT 2026 · DIAN
              </a>
            </div>
          </div>

          <p className="mt-5 max-w-5xl text-[10px] leading-4 text-slate-700">
            Información general con fines preventivos y comerciales. No constituye concepto jurídico ni garantiza una calificación específica. Las medidas y sanciones dependen de los hechos, la autoridad competente y el procedimiento aplicable.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <motion.button
          type="button"
          onClick={() => scrollToSection("diagnostico", "mobile_sticky")}
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 160, damping: 20 }}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
        >
          Evaluar exposición de mi empresa
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
