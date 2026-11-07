"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowDown, ArrowRight, BadgeCheck, CheckCircle2, FileText,
  HeartHandshake, LockKeyhole, MapPin, ShieldCheck, Sparkles,
  UploadCloud, Users, X, LoaderCircle, BriefcaseBusiness,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const MAX_BYTES = 10 * 1024 * 1024;
type SubmissionState = "idle" | "preparing" | "uploading" | "confirming" | "done";

const opportunities = [
  { icon: Users, title: "Talento que transforma", description: "Conecta tu experiencia con proyectos que impulsan entornos de trabajo más seguros." },
  { icon: HeartHandshake, title: "Trabajo en equipo", description: "Un entorno de colaboración, acompañamiento y aprendizaje profesional." },
  { icon: BriefcaseBusiness, title: "Diferentes modalidades", description: "Cuéntanos dónde estás y cómo te gustaría aportar a nuestra operación." },
];

function toString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export default function TalentoLanding() {
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const reducedMotion = useReducedMotion();

  const busy = state !== "idle" && state !== "done";

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.currentTarget.files?.[0] ?? null;
    setError("");
    if (!selected) {
      setFile(null);
      return;
    }
    if (
      !selected.name.toLowerCase().endsWith(".pdf") ||
      (selected.type && selected.type !== "application/pdf") ||
      selected.size > MAX_BYTES ||
      selected.size < 100
    ) {
      setFile(null);
      event.currentTarget.value = "";
      setError("Adjunta un PDF válido de hasta 10 MB.");
      return;
    }
    setFile(selected);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || state === "done") return;
    if (!file) {
      setError("Selecciona tu hoja de vida en formato PDF.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    setError("");
    setState("preparing");

    try {
      const start = await fetch("/api/talento/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: toString(form.get("fullName")),
          email: toString(form.get("email")),
          phone: toString(form.get("phone")),
          city: toString(form.get("city")),
          profession: toString(form.get("profession")),
          experienceYears: toString(form.get("experienceYears")),
          availability: toString(form.get("availability")),
          message: toString(form.get("message")),
          cvFileName: file.name,
          consent: form.get("consent") === "on",
          website: toString(form.get("website")),
          utmSource: params.get("utm_source")?.slice(0, 120) ?? "",
          utmMedium: params.get("utm_medium")?.slice(0, 120) ?? "",
          utmCampaign: params.get("utm_campaign")?.slice(0, 150) ?? "",
          utmContent: params.get("utm_content")?.slice(0, 150) ?? "",
        }),
      });

      const startData = await start.json();
      if (!start.ok) throw new Error(startData.error ?? "No pudimos iniciar la postulación.");

      setState("uploading");
      const upload = new FormData();
      upload.append("file", file);
      upload.append("api_key", startData.apiKey);
      upload.append("signature", startData.signature);
      for (const [key, value] of Object.entries(startData.uploadParameters as Record<string, string>)) {
        upload.append(key, value);
      }
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${startData.cloudName}/raw/upload`,
        { method: "POST", body: upload }
      );

      if (!uploadResponse.ok) {
        throw new Error("No se pudo subir el PDF. Verifica el archivo e intenta de nuevo.");
      }

      setState("confirming");
      const confirm = await fetch("/api/talento/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: startData.applicationId,
          confirmationToken: startData.confirmationToken,
        }),
      });
      const confirmData = await confirm.json();
      if (!confirm.ok) throw new Error(confirmData.error ?? "No pudimos confirmar tu postulación.");

      setReference(confirmData.applicationId);
      setState("done");
      setFile(null);
      formRef.current?.reset();
      // Evento solo después de registrar el PDF y la postulación exitosamente.
      const browser = window as Window & { dataLayer?: Array<Record<string, unknown>>; fbq?: (...args: unknown[]) => void };
      browser.dataLayer?.push({ event: "talento_postulacion_recibida" });
      browser.fbq?.("track", "CompleteRegistration", { content_name: "talento_sis" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ocurrió un error. Intenta nuevamente.");
      setState("idle");
    }
  }

  const inputStyle =
    "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100";
  const labelStyle = "block text-sm font-bold text-slate-700";
  const itemMotion = reducedMotion ? undefined : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.65 } };

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#040608] text-white selection:bg-sky-300/30">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_13%_9%,rgba(42,183,246,.16),transparent_35%),radial-gradient(ellipse_at_90%_32%,rgba(8,10,156,.26),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[.035] [background-image:linear-gradient(rgba(255,255,255,.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.65)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/" aria-label="SIS, ir al inicio" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-sky-300/20 bg-white/[.06] shadow-xl backdrop-blur-xl">
            <ShieldCheck className="size-6 text-sky-300" />
          </span>
          <span>
            <span className="block text-base font-black leading-none tracking-[.16em]">SIS</span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.13em] text-slate-400">Riesgos Laborales</span>
          </span>
        </a>
        <a href="#postulacion" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-4 text-xs font-bold text-white backdrop-blur-xl transition hover:border-sky-300/50 hover:bg-sky-300/10 sm:px-5 sm:text-sm">
          Postularme <ArrowRight className="size-4" />
        </a>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <motion.div {...itemMotion}>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.17em] text-sky-200">
              <Sparkles className="size-3.5" /> Convocatoria de talento
            </span>
            <h1 className="mt-7 max-w-3xl text-[clamp(2.7rem,6vw,5.6rem)] font-extrabold leading-[1.06] tracking-[-.055em]">
              Tu experiencia puede <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">hacer la diferencia.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              En SIS creemos en las personas que hacen de la seguridad y salud en el trabajo una prioridad. Queremos conocer tu perfil y descubrir cómo podemos construir juntos.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#postulacion" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#080a24] shadow-[0_16px_40px_rgba(255,255,255,.12)] transition hover:bg-sky-100">
                Enviar mi hoja de vida <ArrowRight className="size-4" />
              </a>
              <a href="#conoce-sis" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
                Conoce la convocatoria <ArrowDown className="size-4" />
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <LockKeyhole className="size-4 text-sky-300" /> Tu información y tu hoja de vida se reciben mediante un proceso protegido.
            </p>
          </motion.div>

          <motion.div {...itemMotion} className="relative mx-auto flex aspect-[1.15] w-full max-w-xl items-center justify-center">
            <div className="absolute inset-[9%] rounded-full bg-sky-500/15 blur-[80px]" />
            <div className="absolute inset-[7%] rounded-full border border-white/10" />
            <div className="absolute inset-[18%] rounded-full border border-dashed border-sky-300/25" />
            <div className="absolute inset-[28%] rounded-full border border-white/10" />
            <div className="relative flex size-[42%] items-center justify-center rounded-[2.8rem] border border-sky-300/25 bg-gradient-to-br from-sky-400/20 via-[#111b34] to-[#070a15] shadow-[0_30px_90px_rgba(0,0,0,.5)] backdrop-blur-2xl">
              <Users className="size-[42%] text-sky-200" strokeWidth={1.4} />
              <div className="absolute -bottom-4 rounded-full border border-emerald-300/30 bg-[#10221e] px-4 py-2 text-[11px] font-bold text-emerald-200 shadow-xl">
                Talento que cuida personas
              </div>
            </div>
            <div className="absolute left-0 top-[15%] flex items-center gap-2 rounded-2xl border border-white/10 bg-[#101723]/90 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-xl sm:left-[3%]">
              <BadgeCheck className="size-5 text-sky-300" /> Propósito
            </div>
            <div className="absolute bottom-[18%] right-0 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#101723]/90 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-xl sm:right-[3%]">
              <MapPin className="size-5 text-sky-300" /> Colombia
            </div>
          </motion.div>
        </section>

        <section id="conoce-sis" className="border-y border-white/10 bg-white/[.025] px-5 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-sky-300">Nuestra comunidad</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Donde el talento encuentra propósito.</h2>
              <p className="mt-4 leading-7 text-slate-400">Comparte tu perfil profesional para que nuestro equipo lo conozca en futuras oportunidades de colaboración.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {opportunities.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-[1.6rem] border border-white/10 bg-white/[.045] p-6 backdrop-blur-xl transition hover:border-sky-300/25 hover:bg-white/[.07] sm:p-7">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300"><Icon className="size-6" /></div>
                  <h3 className="mt-6 text-lg font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="postulacion" className="scroll-mt-6 px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
            <div className="lg:sticky lg:top-12 lg:self-start">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-sky-300">El siguiente paso</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-[-.05em] sm:text-5xl">Queremos conocerte.</h2>
              <p className="mt-6 max-w-md text-sm leading-8 text-slate-400 sm:text-base">
                Diligencia tus datos y adjunta tu hoja de vida. Así podremos considerar tu perfil cuando surjan oportunidades compatibles.
              </p>
              <div className="mt-9 space-y-5">
                <p className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sky-300" /> Registro sencillo y gratuito.</p>
                <p className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sky-300" /> Hoja de vida PDF de hasta 10 MB.</p>
                <p className="flex items-start gap-3 text-sm text-slate-300"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sky-300" /> No implica una oferta o contratación inmediata.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-slate-950 shadow-[0_35px_100px_rgba(0,0,0,.4)] sm:p-8 md:p-10">
              {state === "done" ? (
                <div role="status" className="flex min-h-[420px] flex-col items-center justify-center py-12 text-center">
                  <span className="flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-10" /></span>
                  <h3 className="mt-7 text-3xl font-extrabold tracking-[-.04em]">¡Postulación recibida!</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                    Gracias por compartir tu perfil con SIS. Tu información y el PDF quedaron registrados para su revisión.
                  </p>
                  <p className="mt-4 break-all text-xs text-slate-400">Referencia: {reference}</p>
                  <button type="button" onClick={() => { setState("idle"); setReference(""); setError(""); }} className="mt-8 rounded-full bg-[#080a9c] px-7 py-3 text-sm font-extrabold text-white transition hover:bg-[#171bb7]">
                    Registrar otra postulación
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={submit} className="space-y-6">
                  <div className="border-b border-slate-100 pb-6">
                    <p className="text-xs font-extrabold uppercase tracking-[.16em] text-sky-700">Formulario de postulación</p>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-[-.04em] sm:text-3xl">Cuéntanos sobre ti</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Los campos marcados con * son obligatorios.</p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className={labelStyle}>Nombre completo *<input name="fullName" autoComplete="name" required minLength={4} maxLength={120} placeholder="Tu nombre y apellido" className={inputStyle} disabled={busy} /></label>
                    <label className={labelStyle}>Correo electrónico *<input name="email" type="email" autoComplete="email" required maxLength={190} placeholder="nombre@correo.com" className={inputStyle} disabled={busy} /></label>
                    <label className={labelStyle}>Teléfono / WhatsApp *<input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={20} placeholder="300 000 0000" className={inputStyle} disabled={busy} /></label>
                    <label className={labelStyle}>Ciudad de residencia *<input name="city" autoComplete="address-level2" required minLength={2} maxLength={120} placeholder="Ej. Pereira" className={inputStyle} disabled={busy} /></label>
                    <label className={labelStyle}>Profesión u oficio *<input name="profession" required minLength={2} maxLength={140} placeholder="Ej. Profesional en SST" className={inputStyle} disabled={busy} /></label>
                    <label className={labelStyle}>Años de experiencia *<input name="experienceYears" type="number" required min={0} max={60} step={1} defaultValue="0" className={inputStyle} disabled={busy} /></label>
                    <label className={labelStyle + " sm:col-span-2"}>Modalidad de interés *
                      <select name="availability" required defaultValue="" className={inputStyle} disabled={busy}>
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="PRESENCIAL">Presencial</option>
                        <option value="VIRTUAL">Virtual / remota</option>
                        <option value="MIXTA">Mixta / ambas</option>
                      </select>
                    </label>
                  </div>
                  <label className={labelStyle}>Cuéntanos brevemente sobre tu perfil <span className="font-normal text-slate-400">(opcional)</span>
                    <textarea name="message" maxLength={1200} rows={3} placeholder="Especialidad, experiencia, licencias o áreas en las que te gustaría aportar..." className={inputStyle + " min-h-28 resize-y py-3"} disabled={busy} />
                  </label>

                  <div>
                    <span className={labelStyle}>Hoja de vida en PDF *</span>
                    <label className={"mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition focus-within:ring-4 focus-within:ring-sky-100 " + (file ? "border-sky-400 bg-sky-50" : "border-slate-200 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/60")}>
                      <UploadCloud className="size-8 text-sky-600" />
                      <span className="mt-2 max-w-full break-all text-sm font-bold text-slate-800">{file ? file.name : "Seleccionar hoja de vida"}</span>
                      <span className="mt-1 text-xs text-slate-500">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB · PDF` : "Únicamente PDF · máximo 10 MB"}</span>
                      <input type="file" name="resume" accept=".pdf,application/pdf" required={!file} onChange={selectFile} className="sr-only" disabled={busy} />
                    </label>
                    {file && <button type="button" disabled={busy} onClick={() => { setFile(null); const input = formRef.current?.querySelector<HTMLInputElement>('input[name="resume"]'); if (input) input.value = ""; }} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600"><X className="size-3.5" /> Quitar archivo</button>}
                  </div>

                  <div className="hidden" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <input name="consent" type="checkbox" required disabled={busy} className="mt-1 size-4 shrink-0 accent-[#080a9c]" />
                    <span className="text-xs leading-6 text-slate-600">
                      <strong>Autorizo el tratamiento de mis datos personales</strong>, incluidos los contenidos en mi hoja de vida, por SIS para gestionar mi postulación, contactarme y evaluar posibles oportunidades profesionales. Puedo solicitar acceso, actualización, rectificación o supresión de mis datos escribiendo a <a className="font-bold text-sky-700 underline underline-offset-2" href="mailto:contacto@sisriesgos.com">contacto@sisriesgos.com</a>. *
                    </span>
                  </label>

                  {error && <p role="alert" aria-live="assertive" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
                  <button type="submit" disabled={busy} className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#080a9c] px-5 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-950/15 transition hover:bg-[#171bb7] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-70">
                    {busy ? <><LoaderCircle className="size-5 animate-spin" /> {state === "preparing" ? "Preparando registro..." : state === "uploading" ? "Subiendo hoja de vida..." : "Confirmando postulación..."}</> : <>Enviar mi postulación <ArrowRight className="size-5" /></>}
                  </button>
                  <p className="flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-slate-400"><LockKeyhole className="size-3.5 shrink-0" /> Documento almacenado con acceso restringido. No publicamos hojas de vida.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-extrabold text-slate-200">SIS · Riesgos Laborales</span> — Convocatoria de talento</p>
          <a href="mailto:contacto@sisriesgos.com" className="transition hover:text-white">contacto@sisriesgos.com</a>
        </div>
      </footer>
    </div>
  );
}
