"use client";

import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileWarning,
  Gauge,
  HardHat,
  LockKeyhole,
  MessageCircle,
  Radar,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Users,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_SIS_WHATSAPP ?? "573001234567";

const OFFICIAL_SOURCES = {
  sanctions:
    "https://www.suin-juriscol.gov.co/viewDocument.asp?id=30045161",
  closure:
    "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?emergente=1&i=72173",
  uvt:
    "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0227_2025.htm",
};

type RiskLevel = "low" | "medium" | "high" | "critical";

type Question = {
  id: string;
  title: string;
  hint: string;
};

type LeadForm = {
  name: string;
  company: string;
  phone: string;
  city: string;
  workers: string;
};

type BrowserWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const questions: Question[] = [
  {
    id: "evidence",
    title: "¿Podría entregar hoy las evidencias clave del SG-SST?",
    hint: "Matriz, plan anual, evaluación, responsables, firmas y seguimiento.",
  },
  {
    id: "execution",
    title: "¿Lo planeado realmente se ejecuta y queda demostrado?",
    hint: "Capacitaciones, inspecciones, controles y acciones cerradas.",
  },
  {
    id: "committees",
    title: "¿COPASST o Vigía, CCL y brigada están funcionando?",
    hint: "No solo conformados: actas, compromisos y seguimiento.",
  },
  {
    id: "incidents",
    title: "¿Los accidentes e incidentes se investigan y se cierran?",
    hint: "Causas reales, acciones eficaces y trazabilidad.",
  },
  {
    id: "external",
    title: "¿Controla contratistas, emergencias y riesgos críticos?",
    hint: "Validación antes de ingresar y control durante la operación.",
  },
];

const answerOptions = [
  {
    label: "Sí, completamente",
    description: "Está actualizado y puedo demostrarlo.",
    points: 0,
    icon: Check,
  },
  {
    label: "Parcialmente",
    description: "Hay avances, pero también vacíos.",
    points: 2,
    icon: AlertTriangle,
  },
  {
    label: "No / no estoy seguro",
    description: "No podría responder con confianza.",
    points: 4,
    icon: X,
  },
];

const riskCards = [
  {
    icon: CircleDollarSign,
    amount: "$689 millones",
    label: "Tope por incumplimientos generales",
    caption: "La sanción se gradúa según el caso y el tamaño de la empresa.",
    glow: "from-rose-500/25",
  },
  {
    icon: Siren,
    amount: "$1,38 mil millones",
    label: "Tope en escenarios de mayor gravedad",
    caption: "Puede aplicar ante omisiones o muerte laboral con incumplimiento demostrado.",
    glow: "from-red-600/30",
  },
  {
    icon: LockKeyhole,
    amount: "120 días",
    label: "De cierre, o incluso definitivo",
    caption: "La medida puede escalar si persisten los hechos o hay reincidencia.",
    glow: "from-amber-500/25",
  },
];

const warningSignals = [
  {
    icon: FileWarning,
    title: "Documentos sin prueba",
    text: "Un formato guardado no demuestra ejecución.",
  },
  {
    icon: Clock3,
    title: "Obligaciones vencidas",
    text: "Lo desactualizado se vuelve visible en una revisión.",
  },
  {
    icon: Users,
    title: "Comités de papel",
    text: "Actas sin seguimiento dejan compromisos abiertos.",
  },
  {
    icon: HardHat,
    title: "Riesgos sin control",
    text: "Contratistas y tareas críticas pueden exponer toda la operación.",
  },
];

const trustStats = [
  { value: "11+", label: "años de experiencia" },
  { value: "100+", label: "empresas acompañadas" },
  { value: "40+", label: "profesionales SST" },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function trackEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const browser = window as BrowserWindow;
  browser.dataLayer?.push({ event, ...data });
  browser.gtag?.("event", event, data);

  const metaEvents: Record<string, string> = {
    quiz_start: "ViewContent",
    quiz_complete: "CompleteRegistration",
    lead_submit: "Lead",
    whatsapp_open: "Contact",
  };

  const metaEvent = metaEvents[event];
  if (metaEvent) browser.fbq?.("track", metaEvent, data);
  else browser.fbq?.("trackCustom", event, data);
}

function scrollTo(id: string, source: string) {
  trackEvent("cta_click", { source });
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function formatPhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 12);
}

function readUtmParameters() {
  if (typeof window === "undefined") return "Sin parámetros UTM";

  const params = new URLSearchParams(window.location.search);
  const values = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((key) => {
      const value = params.get(key);
      return value ? `${key}: ${value}` : null;
    })
    .filter(Boolean);

  return values.length ? values.join(" | ") : "Sin parámetros UTM";
}

function getRisk(score: number): {
  level: RiskLevel;
  label: string;
  headline: string;
  summary: string;
  action: string;
  progress: number;
  styles: string;
} {
  if (score >= 17) {
    return {
      level: "critical",
      label: "Exposición crítica",
      headline: "No conviene esperar a que ocurra el evento.",
      summary:
        "Las respuestas muestran vacíos que pueden dificultar una defensa documental y operativa.",
      action: "Prioridad inmediata",
      progress: 96,
      styles: "border-red-500/40 bg-red-500/10 text-red-100",
    };
  }

  if (score >= 11) {
    return {
      level: "high",
      label: "Exposición alta",
      headline: "Hay brechas que deben cerrarse pronto.",
      summary:
        "La empresa tiene avances, pero aún existen puntos que podrían convertirse en hallazgos.",
      action: "Intervención prioritaria",
      progress: 74,
      styles: "border-orange-400/40 bg-orange-400/10 text-orange-100",
    };
  }

  if (score >= 5) {
    return {
      level: "medium",
      label: "Exposición media",
      headline: "La base existe, pero todavía hay puntos débiles.",
      summary:
        "Una revisión focalizada puede ordenar evidencias y cerrar brechas antes de una visita.",
      action: "Revisión preventiva",
      progress: 48,
      styles: "border-amber-300/40 bg-amber-300/10 text-amber-50",
    };
  }

  return {
    level: "low",
    label: "Exposición controlada",
    headline: "Las respuestas muestran una buena base.",
    summary:
      "Conviene validar vigencias y trazabilidad para confirmar que no existan puntos ciegos.",
    action: "Validación de mantenimiento",
    progress: 22,
    styles: "border-emerald-400/40 bg-emerald-400/10 text-emerald-50",
  };
}

function SoftGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#040608]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(42,183,246,0.17),transparent_30%),radial-gradient(circle_at_92%_24%,rgba(244,63,94,0.13),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(8,10,156,0.18),transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    </div>
  );
}

function RiskVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-[12%] rounded-full bg-sky-400/15 blur-3xl" />

      <svg
        viewBox="0 0 520 520"
        role="img"
        aria-label="Escáner visual de riesgos del SG-SST"
        className="relative h-full w-full"
      >
        <defs>
          <linearGradient id="riskRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2ab7f6" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity=".35" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
          <radialGradient id="riskCore">
            <stop offset="0%" stopColor="#2ab7f6" stopOpacity=".20" />
            <stop offset="100%" stopColor="#040608" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="260" cy="260" r="225" fill="url(#riskCore)" />
        {[214, 166, 118].map((radius, index) => (
          <motion.circle
            key={radius}
            cx="260"
            cy="260"
            r={radius}
            fill="none"
            stroke={index === 0 ? "url(#riskRing)" : "rgba(255,255,255,.16)"}
            strokeWidth={index === 0 ? 1.6 : 1}
            strokeDasharray={index === 0 ? "10 12" : "3 14"}
            animate={
              reduceMotion
                ? undefined
                : { rotate: index % 2 === 0 ? 360 : -360 }
            }
            transition={{
              duration: 18 + index * 6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "260px 260px" }}
          />
        ))}

        <motion.path
          d="M260 260 L260 62 A198 198 0 0 1 430 158 Z"
          fill="rgba(42,183,246,.08)"
          stroke="rgba(42,183,246,.25)"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "260px 260px" }}
        />

        <motion.circle
          cx="260"
          cy="260"
          r="70"
          fill="#071016"
          stroke="url(#riskRing)"
          strokeWidth="2"
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "260px 260px" }}
        />

        <path
          d="M260 218 297 232v29c0 28-16 51-37 60-21-9-37-32-37-60v-29l37-14Z"
          fill="none"
          stroke="#f8fafc"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="m244 260 12 12 22-27"
          fill="none"
          stroke="#2ab7f6"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {[
          { x: 130, y: 160, color: "#fb7185", delay: 0 },
          { x: 408, y: 205, color: "#f59e0b", delay: 0.7 },
          { x: 165, y: 392, color: "#38bdf8", delay: 1.4 },
        ].map((point) => (
          <g key={`${point.x}-${point.y}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill={point.color}
              animate={
                reduceMotion
                  ? undefined
                  : { r: [10, 28, 10], opacity: [0.38, 0, 0.38] }
              }
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: point.delay,
              }}
            />
            <circle cx={point.x} cy={point.y} r="5" fill={point.color} />
          </g>
        ))}
      </svg>

      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
        className="absolute right-0 top-[15%] rounded-2xl border border-rose-400/20 bg-black/55 px-4 py-3 shadow-2xl backdrop-blur-xl"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300">
          Alerta
        </p>
        <p className="mt-1 text-sm font-semibold text-white">Evidencia incompleta</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.65 }}
        className="absolute bottom-[14%] left-0 rounded-2xl border border-sky-400/20 bg-black/55 px-4 py-3 shadow-2xl backdrop-blur-xl"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
          Diagnóstico
        </p>
        <p className="mt-1 text-sm font-semibold text-white">Resultado inmediato</p>
      </motion.div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3.5 py-2 text-xs font-semibold text-slate-200 backdrop-blur-xl">
      <BadgeCheck className="h-4 w-4 text-sky-300" />
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  source,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  source: string;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => {
        trackEvent("cta_click", { source });
        onClick();
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_18px_70px_rgba(255,255,255,.13)] transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </motion.button>
  );
}

function Quiz() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [lead, setLead] = useState<LeadForm>({
    name: "",
    company: "",
    phone: "",
    city: "",
    workers: "",
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const score = useMemo(
    () => Object.values(answers).reduce((total, item) => total + item, 0),
    [answers],
  );
  const risk = useMemo(() => getRisk(score), [score]);
  const question = questions[current];
  const progress = completed ? 100 : ((current + 1) / questions.length) * 100;

  const begin = () => {
    setStarted(true);
    trackEvent("quiz_start", { source: "quiz_card" });
  };

  const answer = (points: number, label: string) => {
    const next = { ...answers, [question.id]: points };
    setAnswers(next);
    trackEvent("quiz_answer", {
      question: question.id,
      answer: label,
      points,
    });

    if (current === questions.length - 1) {
      const finalScore = Object.values(next).reduce(
        (total, item) => total + item,
        0,
      );
      setCompleted(true);
      trackEvent("quiz_complete", {
        score: finalScore,
        risk_level: getRisk(finalScore).level,
      });
      return;
    }

    setCurrent((value) => value + 1);
  };

  const reset = () => {
    setStarted(false);
    setCurrent(0);
    setAnswers({});
    setCompleted(false);
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!lead.name || !lead.company || lead.phone.length < 10 || !lead.city) {
      setError("Complete nombre, empresa, WhatsApp y ciudad.");
      return;
    }

    if (!consent) {
      setError("Debe autorizar el contacto para continuar.");
      return;
    }

    const message = [
      "Hola, equipo SIS. Realicé el diagnóstico SG-SST de la campaña.",
      "",
      `Resultado: ${risk.label}`,
      `Puntaje: ${score} de 20`,
      `Prioridad: ${risk.action}`,
      "",
      `Nombre: ${lead.name}`,
      `Empresa: ${lead.company}`,
      `WhatsApp: ${lead.phone}`,
      `Ciudad: ${lead.city}`,
      `Trabajadores: ${lead.workers || "No indicado"}`,
      `Campaña: ${readUtmParameters()}`,
      "",
      "Quiero revisar las brechas prioritarias de mi empresa.",
    ].join("\n");

    trackEvent("lead_submit", {
      score,
      risk_level: risk.level,
      workers: lead.workers || "not_provided",
      city: lead.city,
    });
    trackEvent("whatsapp_open", { source: "quiz_result" });

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section
      id="diagnostico"
      className="scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
            Diagnóstico rápido
          </p>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
            Cinco preguntas. Una respuesta clara.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
            Detecte señales de exposición antes de que las encuentre una visita,
            una denuncia o un accidente.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_30px_120px_rgba(0,0,0,.45)] backdrop-blur-2xl">
          {!started ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_.82fr] lg:p-12"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-200">
                  <Gauge className="h-4 w-4" />
                  60 segundos
                </div>
                <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
                  ¿Su empresa podría demostrar cumplimiento hoy?
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">
                  Resultado inmediato, sin descargar archivos ni crear una cuenta.
                </p>
                <PrimaryButton
                  source="quiz_start"
                  onClick={begin}
                  className="mt-7 w-full sm:w-auto"
                >
                  Iniciar diagnóstico gratuito
                </PrimaryButton>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/25 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Recibirá
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    "Nivel de exposición",
                    "Prioridad de intervención",
                    "Contacto directo con SIS",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="h-1.5 bg-white/5">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300"
                />
              </div>

              <AnimatePresence mode="wait">
                {!completed ? (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 sm:p-10 lg:p-12"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
                        Pregunta {current + 1} de {questions.length}
                      </p>
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-white"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reiniciar
                      </button>
                    </div>

                    <h3 className="mt-6 max-w-3xl text-2xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">
                      {question.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                      {question.hint}
                    </p>

                    <div className="mt-8 grid gap-3">
                      {answerOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.button
                            key={option.label}
                            type="button"
                            onClick={() => answer(option.points, option.label)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-sky-300/35 hover:bg-sky-300/[0.06] sm:p-5"
                          >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition group-hover:border-sky-300/25 group-hover:text-sky-200">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-white sm:text-base">
                                {option.label}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-slate-500 sm:text-sm">
                                {option.description}
                              </span>
                            </span>
                            <ChevronRight className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-sky-300" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[.92fr_1.08fr] lg:p-12"
                  >
                    <div>
                      <div
                        className={`rounded-3xl border p-6 ${risk.styles}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] opacity-80">
                              Resultado
                            </p>
                            <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">
                              {risk.label}
                            </h3>
                          </div>
                          <ShieldAlert className="h-8 w-8 shrink-0" />
                        </div>

                        <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/25">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${risk.progress}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="h-full rounded-full bg-current"
                          />
                        </div>

                        <p className="mt-6 text-lg font-bold">{risk.headline}</p>
                        <p className="mt-2 text-sm leading-6 opacity-80">
                          {risk.summary}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Acción recomendada
                          </p>
                          <p className="mt-1 text-sm font-bold text-white">
                            {risk.action}
                          </p>
                        </div>
                        <Radar className="h-6 w-6 text-sky-300" />
                      </div>

                      <button
                        type="button"
                        onClick={reset}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-white"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Repetir diagnóstico
                      </button>
                    </div>

                    <form onSubmit={submit} className="rounded-3xl bg-white p-5 text-slate-950 sm:p-7">
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-700">
                        Siguiente paso
                      </p>
                      <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
                        Revise sus brechas con SIS
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Complete los datos y continúe por WhatsApp.
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Input
                          label="Nombre"
                          value={lead.name}
                          onChange={(value) => setLead({ ...lead, name: value })}
                          placeholder="Su nombre"
                          autoComplete="name"
                        />
                        <Input
                          label="Empresa"
                          value={lead.company}
                          onChange={(value) => setLead({ ...lead, company: value })}
                          placeholder="Nombre de la empresa"
                          autoComplete="organization"
                        />
                        <Input
                          label="WhatsApp"
                          value={lead.phone}
                          onChange={(value) =>
                            setLead({ ...lead, phone: formatPhone(value) })
                          }
                          placeholder="3001234567"
                          autoComplete="tel"
                          inputMode="tel"
                        />
                        <Input
                          label="Ciudad"
                          value={lead.city}
                          onChange={(value) => setLead({ ...lead, city: value })}
                          placeholder="Pereira"
                          autoComplete="address-level2"
                        />
                      </div>

                      <label className="mt-3 block text-xs font-bold text-slate-600">
                        Número de trabajadores (opcional)
                        <select
                          value={lead.workers}
                          onChange={(event) =>
                            setLead({ ...lead, workers: event.target.value })
                          }
                          className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="1-10">1 a 10</option>
                          <option value="11-50">11 a 50</option>
                          <option value="51-200">51 a 200</option>
                          <option value="201+">Más de 200</option>
                        </select>
                      </label>

                      <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => setConsent(event.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600"
                        />
                        <span>
                          Autorizo a SIS a contactarme para ampliar el resultado del diagnóstico.
                        </span>
                      </label>

                      {error && (
                        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#080a9c] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-950/20 transition hover:bg-[#1114c6] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Hablar con un profesional
                      </button>

                      <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                        Valoración comercial inicial. No reemplaza una auditoría ni una actuación de autoridad.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
}) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
      />
    </label>
  );
}

export default function SgsstComplianceLanding() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#040608] text-white selection:bg-sky-400/30">
      <SoftGrid />

      <motion.div
        style={{ scaleX: progress, transformOrigin: "0%" }}
        className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300"
      />

      <header className="absolute inset-x-0 top-0 z-40 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-lg backdrop-blur-xl">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-[0.16em] text-white">
                SIS
              </p>
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:block">
                Riesgos Laborales
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollTo("diagnostico", "header")}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 text-xs font-bold text-white backdrop-blur-xl transition hover:border-sky-300/40 hover:bg-sky-300/10"
          >
            Diagnóstico gratis
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[92svh] items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-6">
            <motion.div
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65 }}
              className="max-w-3xl"
            >
              <div className="flex flex-wrap gap-2">
                <Pill>Diagnóstico en 60 segundos</Pill>
                <Pill>Resultado inmediato</Pill>
              </div>

              <h1 className="mt-7 text-balance text-[clamp(2.75rem,7.2vw,6.6rem)] font-extrabold leading-[0.94] tracking-[-0.065em] text-white">
                Una brecha puede costar millones.
                <span className="mt-2 block bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
                  O detener su operación.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-400 sm:text-xl sm:leading-8">
                Descubra si su empresa podría sostener hoy una visita, una denuncia o un accidente con evidencias reales.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton
                  source="hero"
                  onClick={() =>
                    document.getElementById("diagnostico")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="w-full sm:w-auto"
                >
                  Revisar mi empresa ahora
                </PrimaryButton>
                <button
                  type="button"
                  onClick={() => scrollTo("riesgos", "hero_secondary")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-slate-300 transition hover:text-white"
                >
                  Ver las consecuencias
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Sin registro. Sin descargas. Confidencial.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="hidden lg:block"
            >
              <RiskVisual />
            </motion.div>
          </div>
        </section>

        <section id="riesgos" className="scroll-mt-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
              className="mb-9 max-w-3xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-300">
                Lo que realmente duele
              </p>
              <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">
                Cifras que cualquier gerente entiende.
              </h2>
            </motion.div>

            <div className="grid gap-4 lg:grid-cols-3">
              {riskCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.article
                    key={card.amount}
                    variants={reveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_90px_rgba(0,0,0,.3)] backdrop-blur-xl sm:p-7"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.glow} via-transparent to-transparent opacity-70`} />
                    <div className="relative">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="mt-7 text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                        {card.amount}
                      </p>
                      <h3 className="mt-3 text-base font-bold text-slate-200">
                        {card.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {card.caption}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <p className="mt-5 max-w-4xl text-xs leading-5 text-slate-600">
              Valores aproximados para 2026. No son automáticos: la autoridad gradúa cada sanción según el tipo de incumplimiento, tamaño, gravedad, reincidencia y demás criterios legales.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
                Señales de alerta
              </p>
              <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">
                El problema casi nunca empieza el día de la visita.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                Empieza meses antes, cuando nadie ve lo que quedó vencido, incompleto o sin seguimiento.
              </p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              {warningSignals.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={reveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white sm:text-base">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <Quiz />

        <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-6 sm:p-9 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_.86fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                  <ClipboardCheck className="h-4 w-4" />
                  Acompañamiento empresarial
                </div>
                <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl">
                  No espere a descubrir la brecha en el peor momento.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                  SIS organiza la evidencia, prioriza la intervención y acompaña la ejecución del SG-SST.
                </p>
                <PrimaryButton
                  source="final_cta"
                  onClick={() =>
                    document.getElementById("diagnostico")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="mt-7 w-full sm:w-auto"
                >
                  Obtener mi diagnóstico
                </PrimaryButton>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-black/20 px-3 py-5 text-center sm:px-5"
                  >
                    <p className="text-2xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-slate-500 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-slate-400">SIS · Riesgos Laborales</p>
            <p className="mt-1">Diagnóstico comercial inicial y confidencial.</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a
              href={OFFICIAL_SOURCES.sanctions}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-slate-300"
            >
              Multas oficiales
            </a>
            <a
              href={OFFICIAL_SOURCES.closure}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-slate-300"
            >
              Cierres oficiales
            </a>
            <a
              href={OFFICIAL_SOURCES.uvt}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-slate-300"
            >
              Valor 2026
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#040608]/90 p-3 backdrop-blur-xl sm:hidden">
        <button
          type="button"
          onClick={() => scrollTo("diagnostico", "mobile_sticky")}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-slate-950"
        >
          Diagnóstico gratuito
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
