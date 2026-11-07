"use client";

import Image from "next/image";
import gestionDocumentalImage from "@/public/images/gestion-documental.webp";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole, UploadCloud, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const MAX_BYTES = 10 * 1024 * 1024;
type SubmissionState = "idle" | "preparing" | "uploading" | "confirming" | "done";

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
    "mt-2 h-12 w-full rounded-xl border border-[#e5e5e7] bg-[#f5f5f7] px-4 text-sm font-medium text-[#1d1d1f] outline-none transition placeholder:font-normal placeholder:text-[#91919a] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";
  const labelStyle = "block text-sm font-semibold text-[#303038]";
  const itemMotion = reducedMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-200 lg:flex lg:h-dvh lg:min-h-0 lg:flex-col lg:overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(ellipse_at_18%_22%,rgba(36,100,255,0.09),transparent_46%),radial-gradient(ellipse_at_86%_12%,rgba(0,186,220,0.08),transparent_44%)]"
      />

      <header className="relative z-20 px-4 pt-5 sm:px-8 sm:pt-7 lg:shrink-0">
        <nav aria-label="Navegación de postulaciones" className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-black/[0.055] bg-white/95 px-5 py-3 shadow-[0_10px_40px_rgba(28,33,51,0.07)] backdrop-blur-2xl sm:px-7">
          <a href="/" aria-label="Ir a la página principal de SIS" className="inline-flex shrink-0 items-center">
            <Image src="/images/logo.png" alt="SIS" width={128} height={44} priority className="h-9 w-auto max-w-[128px] object-contain" />
          </a>
          <a
            href="#postulacion"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-4 text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#244dce] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:px-6 sm:text-sm"
          >
            Enviar hoja de vida <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </nav>
      </header>

      <main className="lg:min-h-0 lg:flex-1">
        <section className="relative mx-auto w-full max-w-[1300px] px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14 lg:h-full lg:overflow-hidden lg:px-10 lg:pb-5 lg:pt-5">
          <div className="grid min-w-0 grid-cols-1 items-start gap-y-8 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-stretch lg:gap-x-12 lg:gap-y-0 xl:gap-x-16">
            {/* Desktop: el panel derecho se desplaza independientemente de la imagen.
                Móvil: display contents conserva título → imagen → formulario. */}
            <div className="contents lg:order-2 lg:block lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:scroll-smooth lg:pb-8 lg:pr-2 lg:[scrollbar-width:thin] lg:[scrollbar-color:#c8cbd2_transparent]">
            <motion.div
              {...itemMotion}
              className="order-1 min-w-0 lg:pt-4"
            >
              <h1 className="max-w-2xl text-balance text-[clamp(2.5rem,4.4vw,4.8rem)] font-extrabold leading-[1.07] tracking-[-0.06em]">
                Tu experiencia puede
                <span className="block bg-gradient-to-r from-[#285bff] via-[#3475f4] to-[#00b4de] bg-clip-text text-transparent">
                  hacer la diferencia.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-[#777984] sm:text-lg sm:leading-8">
                En SIS trabajamos por entornos laborales más seguros. Queremos conocer tu experiencia para futuros proyectos de seguridad y salud en el trabajo.
              </p>
              <a
                href="#postulacion"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(29,29,31,0.13)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#244dce] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 sm:text-base"
              >
                Compartir mi hoja de vida
                <ArrowRight aria-hidden="true" className="size-5" />
              </a>
            </motion.div>

            <div id="postulacion" className="order-3 min-w-0 scroll-mt-6 lg:mt-9">
            <motion.div
              {...itemMotion}
              className="min-w-0 rounded-[1.8rem] border border-black/[0.045] bg-white p-5 text-[#1d1d1f] shadow-[0_22px_65px_rgba(28,33,51,0.065)] sm:rounded-[2.25rem] sm:p-8 xl:p-10"
            >
              {state === "done" ? (
                <div role="status" className="flex min-h-[430px] flex-col items-center justify-center py-12 text-center">
                  <span className="flex size-18 items-center justify-center rounded-full bg-[#edf7f1] text-emerald-600">
                    <CheckCircle2 aria-hidden="true" className="size-9" />
                  </span>
                  <h3 className="mt-7 text-3xl font-extrabold tracking-[-0.045em]">Recibimos tu hoja de vida.</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[#777984]">
                    Gracias por tu interés en SIS. Tus datos y el documento quedaron registrados para su revisión.
                  </p>
                  <p className="mt-4 break-all text-xs text-[#92929b]">Referencia: {reference}</p>
                  <button
                    type="button"
                    onClick={() => { setState("idle"); setReference(""); setError(""); }}
                    className="mt-8 rounded-full bg-[#1d1d1f] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#244dce]"
                  >
                    Enviar otra postulación
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={submit} className="space-y-6">
                  <div className="border-b border-[#eeeeef] pb-6">
                    <h3 className="text-2xl font-extrabold tracking-[-0.045em] sm:text-3xl">
                      Déjanos tus datos
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#777984]">
                      Los campos marcados con * son obligatorios.
                    </p>
                  </div>

                  <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <label className={labelStyle}>
                      Nombre completo *
                      <input name="fullName" autoComplete="name" required minLength={4} maxLength={120} placeholder="Tu nombre y apellido" className={inputStyle} disabled={busy} />
                    </label>
                    <label className={labelStyle}>
                      Correo electrónico *
                      <input name="email" type="email" autoComplete="email" required maxLength={190} placeholder="nombre@correo.com" className={inputStyle} disabled={busy} />
                    </label>
                    <label className={labelStyle}>
                      Teléfono / WhatsApp *
                      <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={20} placeholder="300 000 0000" className={inputStyle} disabled={busy} />
                    </label>
                    <label className={labelStyle}>
                      Ciudad de residencia *
                      <input name="city" autoComplete="address-level2" required minLength={2} maxLength={120} placeholder="Ej. Pereira" className={inputStyle} disabled={busy} />
                    </label>
                    <label className={labelStyle}>
                      Profesión u oficio *
                      <input name="profession" required minLength={2} maxLength={140} placeholder="Ej. Profesional en SST" className={inputStyle} disabled={busy} />
                    </label>
                    <label className={labelStyle}>
                      Años de experiencia *
                      <input name="experienceYears" type="number" required min={0} max={60} step={1} defaultValue="0" className={inputStyle} disabled={busy} />
                    </label>
                    <label className={labelStyle + " sm:col-span-2"}>
                      Modalidad de interés *
                      <select name="availability" required defaultValue="" className={inputStyle} disabled={busy}>
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="PRESENCIAL">Presencial</option>
                        <option value="VIRTUAL">Virtual / remota</option>
                        <option value="MIXTA">Mixta / ambas</option>
                      </select>
                    </label>
                  </div>

                  <label className={labelStyle}>
                    Cuéntanos brevemente sobre tu perfil <span className="font-normal text-[#92929b]">(opcional)</span>
                    <textarea
                      name="message"
                      maxLength={1200}
                      rows={3}
                      placeholder="Experiencia, especialidad o áreas en las que te gustaría trabajar..."
                      className={inputStyle + " min-h-28 resize-y py-3"}
                      disabled={busy}
                    />
                  </label>

                  <div>
                    <span className={labelStyle}>Hoja de vida en PDF *</span>
                    <label className={"mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition focus-within:ring-4 focus-within:ring-blue-100 " + (file ? "border-blue-400 bg-[#f3f7ff]" : "border-[#dcdfe5] bg-[#f7f8fa] hover:border-blue-400 hover:bg-[#f3f7ff]")}>
                      <UploadCloud aria-hidden="true" className="size-8 text-[#2b61e9]" />
                      <span className="mt-3 max-w-full break-all text-sm font-semibold text-[#303038]">
                        {file ? file.name : "Seleccionar archivo PDF"}
                      </span>
                      <span className="mt-1 text-xs text-[#777984]">
                        {file ? (file.size / (1024 * 1024)).toFixed(2) + " MB · PDF" : "Tamaño máximo de 10 MB"}
                      </span>
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,application/pdf"
                        required={!file}
                        onChange={selectFile}
                        className="sr-only"
                        disabled={busy}
                      />
                    </label>
                    {file && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setFile(null);
                          const input = formRef.current?.querySelector<HTMLInputElement>('input[name="resume"]');
                          if (input) input.value = "";
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#777984] hover:text-red-600"
                      >
                        <X aria-hidden="true" className="size-3.5" /> Quitar archivo
                      </button>
                    )}
                  </div>

                  <div className="hidden" aria-hidden="true">
                    <label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#e5e5e7] bg-[#f7f8fa] p-4 sm:p-5">
                    <input name="consent" type="checkbox" required disabled={busy} className="mt-1 size-4 shrink-0 accent-[#285bff]" />
                    <span className="text-xs leading-6 text-[#666a76]">
                      <strong>Autorizo el tratamiento de mis datos personales</strong>, incluidos los contenidos en mi hoja de vida, por SIS para gestionar mi postulación, contactarme y evaluar posibles oportunidades profesionales. Puedo solicitar acceso, actualización, rectificación o supresión de mis datos escribiendo a <a className="font-semibold text-[#2455d5] underline underline-offset-2" href="mailto:contacto@sisriesgos.com">contacto@sisriesgos.com</a>. *
                    </span>
                  </label>

                  {error && (
                    <p role="alert" aria-live="assertive" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#1d1d1f] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(29,29,31,0.13)] transition-all duration-300 hover:bg-[#244dce] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue-500 disabled:cursor-wait disabled:opacity-70"
                  >
                    {busy ? (
                      <>
                        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                        {state === "preparing" ? "Preparando registro..." : state === "uploading" ? "Subiendo hoja de vida..." : "Confirmando postulación..."}
                      </>
                    ) : (
                      <>Enviar postulación <ArrowRight aria-hidden="true" className="size-5" /></>
                    )}
                  </button>

                  <p className="flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-[#92929b]">
                    <LockKeyhole aria-hidden="true" className="size-3.5 shrink-0" />
                    Tu documento se almacena con acceso restringido.
                  </p>
                </form>
              )}
            </motion.div>
            </div>
              <div className="hidden lg:block lg:pt-8">
                <p className="border-t border-[#e0e1e4] pt-6 text-xs leading-6 text-[#777984]">
                  SIS · Sistema Integral en Riesgos Laborales
                  <span className="block">
                    <a href="mailto:contacto@sisriesgos.com" className="transition-colors hover:text-[#285bff]">contacto@sisriesgos.com</a>
                  </span>
                </p>
              </div>
            </div>

            <motion.figure
              {...itemMotion}
              className="order-2 min-w-0 overflow-hidden rounded-[1.7rem] border border-black/[0.045] bg-white shadow-[0_22px_65px_-25px_rgba(28,33,51,0.15)] sm:rounded-[2.2rem] lg:order-1 lg:flex lg:h-full lg:min-h-0 lg:items-center lg:justify-center"
            >
              <Image
                src={gestionDocumentalImage}
                alt="Profesional de SIS en su espacio de trabajo"
                priority
                placeholder="blur"
                sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 42vw, 510px"
                className="block h-auto w-full object-contain lg:max-h-full lg:max-w-full lg:w-auto"
              />
            </motion.figure>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e5e5e7] px-5 py-7 sm:px-8 lg:hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-xs text-[#777984] sm:flex-row sm:text-left">
          <p>SIS · Sistema Integral en Riesgos Laborales</p>
          <a href="mailto:contacto@sisriesgos.com" className="transition-colors hover:text-[#285bff]">
            contacto@sisriesgos.com
          </a>
        </div>
      </footer>
    </div>
  );
}
