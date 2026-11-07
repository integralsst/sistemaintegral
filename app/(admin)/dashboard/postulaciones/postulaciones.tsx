"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText, LoaderCircle, Search, Users, X } from "lucide-react";

type Status = "RECIBIDA" | "EN_REVISION" | "DESCARTADA";
type Candidate = {
  id: string; nombreCompleto: string; correo: string; ciudad: string;
  profesion: string; estado: Status; creadoEn: string;
};
type Detail = Candidate & {
  telefono: string; aniosExperiencia: number; modalidad: string; mensaje: string | null;
  hojaVidaNombre: string; utmSource: string | null; utmMedium: string | null;
  utmCampaign: string | null; utmContent: string | null;
};
type Results = {
  items: Candidate[]; total: number; page: number; pageSize: number; cities: string[];
  stats: Record<Status | "total", number>;
};
const labels: Record<Status, string> = { RECIBIDA: "Pendiente de revisión", EN_REVISION: "En revisión", DESCARTADA: "Descartada" };
const colors: Record<Status, string> = {
  RECIBIDA: "bg-blue-50 text-blue-700", EN_REVISION: "bg-amber-50 text-amber-800", DESCARTADA: "bg-gray-100 text-gray-600",
};
const control = "min-h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-40";
const date = (value: string) => new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "No pudimos completar la solicitud.");
  return data as T;
}

function Loading({ text = "Cargando postulaciones…" }: { text?: string }) {
  return <div role="status" className="flex min-h-44 items-center justify-center gap-3 text-sm text-gray-500"><LoaderCircle className="size-5 animate-spin" />{text}</div>;
}
function ErrorMessage({ message }: { message: string }) {
  return <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{message}</p>;
}
function Badge({ status }: { status: Status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${colors[status]}`}>{labels[status]}</span>;
}

// Native dialog provides Escape, focus containment and focus restoration.
function Modal({ title, close, children, wide = false }: { title: string; close: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} aria-label={title} onCancel={close}
    className={`fixed inset-0 m-auto h-dvh max-h-dvh w-screen max-w-none overflow-hidden border-0 bg-[#F5F5F7] p-0 text-[#1d1d1f] shadow-2xl backdrop:bg-black/35 backdrop:backdrop-blur-sm sm:h-[92dvh] sm:max-h-[92dvh] sm:w-[94vw] sm:rounded-3xl ${wide ? "sm:max-w-6xl" : "sm:max-w-3xl"}`}>
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
        <h2 className="truncate text-lg font-semibold tracking-tight">{title}</h2>
        <button type="button" autoFocus onClick={close} aria-label="Cerrar" className={`${button} shrink-0 px-3`}><X className="size-5" /></button>
      </header>
      {children}
    </div>
  </dialog>;
}

function PdfViewer({ item, close }: { item: Detail; close: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const [pdf, setPdf] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const endpoint = `/api/admin/postulaciones/${item.id}/pdf`;
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = "";
    const timeout = setTimeout(() => controller.abort(), 45000);
    (async () => {
      try {
        const access = await fetch(endpoint, { method: "POST", cache: "no-store", signal: controller.signal })
          .then(readResponse<{ url: string }>);
        const response = await fetch(access.url, { cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal });
        if (!response.ok) throw new Error("Cloudinary no pudo entregar el documento privado.");
        const blob = await response.blob();
        if (blob.size > 10 * 1024 * 1024 || blob.size < 100 || !(await blob.slice(0, 5).text()).startsWith("%PDF-")) {
          throw new Error("El documento recibido no es un PDF válido.");
        }
        if (controller.signal.aborted) return;
        // Normalize raw/octet-stream to PDF locally. Bytes never cross our API.
        objectUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        setPdf(objectUrl);
      } catch (caught) {
        if (!controller.signal.aborted) setError(caught instanceof TypeError
          ? "No pudimos preparar la vista previa. Reintenta o usa Abrir en nueva pestaña / Descargar."
          : caught instanceof Error ? caught.message : "No pudimos cargar el documento.");
        else if (controller.signal.reason?.name === "AbortError") setError("La descarga tardó demasiado. Intenta nuevamente.");
      } finally { clearTimeout(timeout); }
    })();
    return () => { clearTimeout(timeout); controller.abort("unmounted"); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [endpoint, attempt]);

  return <Modal title="Hoja de vida" close={close} wide>
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-3">
      <p className="min-w-0 break-all text-sm text-gray-600">{item.hojaVidaNombre}</p>
      <div className="flex flex-wrap gap-2">
        <a href={`${endpoint}?mode=inline`} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className={button}><ExternalLink className="size-4" />Abrir en nueva pestaña</a>
        <a href={`${endpoint}?mode=download`} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className={button}><Download className="size-4" />Descargar</a>
      </div>
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-2 px-5 py-3 text-xs text-gray-500">
      <p>Si tu navegador no muestra el PDF, ábrelo en otra pestaña o descárgalo de forma segura.</p>
    </div>
    {error ? <div className="space-y-4 p-5"><ErrorMessage message={error} /><button className={button} onClick={() => { setError(""); setPdf(""); setLoaded(false); setAttempt(value => value + 1); }}>Reintentar</button></div> :
      <div className="relative min-h-0 flex-1">
        {!loaded && <div className="absolute inset-0"><Loading text="Preparando PDF privado…" /></div>}
        {pdf && <iframe title={`Hoja de vida de ${item.nombreCompleto}`} src={pdf} referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)} onError={() => setError("El navegador no pudo mostrar el PDF. Usa Abrir o Descargar.")}
          className={`relative h-full w-full border-0 bg-white ${loaded ? "visible" : "invisible"}`} />}
      </div>}
  </Modal>;
}

function CandidateDetail({ id, close, updated }: { id: string; close: () => void; updated: () => void }) {
  const [item, setItem] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewer, setViewer] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/postulaciones/${id}`, { cache: "no-store", signal: controller.signal })
      .then(readResponse<Detail>).then(setItem).catch(caught => { if (!controller.signal.aborted) setError(caught.message); });
    return () => controller.abort();
  }, [id, attempt]);

  async function changeStatus(estado: Status) {
    setSaving(true); setError(""); setNotice("");
    try {
      await fetch(`/api/admin/postulaciones/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) }).then(readResponse);
      setItem(previous => previous ? { ...previous, estado } : previous);
      setNotice("Estado guardado."); updated();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No pudimos guardar el estado."); }
    finally { setSaving(false); }
  }

  return <Modal title="Detalle de postulación" close={close}>
    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
      {error && <div className="mb-5"><ErrorMessage message={error} />{!item && <button className={`${button} mt-3`} onClick={() => { setError(""); setAttempt(value => value + 1); }}>Reintentar</button>}</div>}
      {!item ? !error && <Loading text="Cargando perfil…" /> : <div className="space-y-6">
        <div><Badge status={item.estado} /><h3 className="mt-4 break-words text-2xl font-semibold tracking-tight">{item.nombreCompleto}</h3><p className="mt-2 break-words text-gray-500">{item.profesion}</p></div>
        <dl className="grid gap-5 rounded-2xl bg-white p-5 text-sm sm:grid-cols-2">
          {([
            ["Correo electrónico", <a key="email" className="text-blue-600" href={`mailto:${item.correo}`}>{item.correo}</a>],
            ["Teléfono / WhatsApp", <a key="phone" className="text-blue-600" href={`https://wa.me/${(() => { const digits = item.telefono.replace(/\D/g, ""); return digits.length === 10 ? `57${digits}` : digits; })()}`} target="_blank" rel="noopener noreferrer">{item.telefono}</a>],
            ["Ciudad", item.ciudad], ["Experiencia", `${item.aniosExperiencia} años`],
            ["Modalidad de interés", { PRESENCIAL: "Presencial", VIRTUAL: "Virtual / remota", MIXTA: "Mixta / ambas" }[item.modalidad]],
            ["Fecha de postulación", date(item.creadoEn)],
          ] as [string, ReactNode][]).map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}
        </dl>
        <section><h4 className="text-sm font-semibold">Presentación profesional</h4><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-gray-600">{item.mensaje || "El postulante no incluyó una presentación."}</p></section>
        <section className="rounded-2xl bg-white p-5"><h4 className="text-sm font-semibold">Hoja de vida</h4><p className="my-3 break-all text-sm text-gray-500">{item.hojaVidaNombre}</p><button className={button} onClick={() => setViewer(true)}><FileText className="size-4" />Ver PDF</button></section>
        <section><h4 className="text-sm font-semibold">Origen de campaña</h4><p className="mt-2 text-sm text-gray-500">Formulario Talento SIS · /talento-sis</p>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">{([["Fuente", item.utmSource], ["Medio", item.utmMedium], ["Campaña", item.utmCampaign], ["Contenido", item.utmContent]]).filter(([, value]) => value).map(([key, value]) => <div key={key}><dt className="text-xs text-gray-500">{key}</dt><dd className="break-words">{value}</dd></div>)}</dl>
        </section>
        <section className="border-t border-gray-200 pt-5"><h4 className="mb-3 text-sm font-semibold">Estado de revisión</h4><div className="flex flex-wrap gap-3">
          <button disabled={saving || item.estado === "EN_REVISION"} onClick={() => changeStatus("EN_REVISION")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1d1d1f] px-4 text-sm font-medium text-white transition hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-40">{saving ? "Guardando…" : "Marcar en revisión"}</button>
          <button disabled={saving || item.estado === "DESCARTADA"} onClick={() => changeStatus("DESCARTADA")} className={`${button} text-red-600`}>Descartar</button>
        </div><p role="status" className="mt-3 text-sm text-emerald-700">{notice}</p></section>
      </div>}
    </div>
    {viewer && item && <PdfViewer item={item} close={() => setViewer(false)} />}
  </Modal>;
}

function Listing({ query, select, navigate }: { query: string; select: (id: string) => void; navigate: (params: URLSearchParams) => void }) {
  const [data, setData] = useState<Results | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/postulaciones?${query}`, { cache: "no-store", signal: controller.signal })
      .then(readResponse<Results>).then(setData).catch(caught => { if (!controller.signal.aborted) setError(caught.message); });
    return () => controller.abort();
  }, [query, attempt]);

  function filter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) => { if (typeof value === "string" && value.trim()) params.set(key, value.trim()); });
    navigate(params);
  }
  const params = new URLSearchParams(query);
  return <>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {([["Postulaciones recibidas", "total"], ["Pendientes de revisión", "RECIBIDA"], ["En revisión", "EN_REVISION"], ["Descartadas", "DESCARTADA"]] as const).map(([label, key]) =>
        <div key={key} className="rounded-2xl border border-black/[0.035] bg-white p-5 shadow-sm"><p className="text-xs text-gray-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{data ? data.stats[key].toLocaleString("es-CO") : "—"}</p></div>)}
    </div>
    <form onSubmit={filter} className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <label className="min-w-0 flex-[2_1_240px]"><span className="sr-only">Buscar por nombre, correo o profesión</span><input name="q" defaultValue={params.get("q") ?? ""} maxLength={120} placeholder="Nombre, correo o profesión" className={`${control} w-full`} /></label>
      <label className="flex-[1_1_180px]"><span className="sr-only">Estado</span><select name="estado" defaultValue={params.get("estado") ?? ""} className={`${control} w-full`}><option value="">Todos los estados</option>{Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label className="flex-[1_1_150px]"><span className="sr-only">Ciudad</span><select name="ciudad" defaultValue={params.get("ciudad") ?? ""} className={`${control} w-full`}><option value="">Todas las ciudades</option>{Array.from(new Set([...(data?.cities ?? []), ...(params.get("ciudad") ? [params.get("ciudad")!] : [])])).map(city => <option key={city}>{city}</option>)}</select></label>
      <button className={button}><Search className="size-4" />Buscar</button>
    </form>
    <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.035] bg-white shadow-sm">
      {error ? <div className="space-y-4 p-5"><ErrorMessage message={error} /><button className={button} onClick={() => { setError(""); setAttempt(value => value + 1); }}>Reintentar</button></div> : !data ? <Loading /> : !data.items.length ?
        <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center"><Users className="size-8 text-gray-400" /><h2 className="mt-4 font-semibold">{data.stats.total ? "No encontramos coincidencias" : "Aún no hay postulaciones confirmadas"}</h2><p className="mt-2 max-w-md text-sm leading-6 text-gray-500">{data.stats.total ? "Prueba con otro nombre, ciudad o estado." : "Aquí aparecerán las postulaciones cuando se confirme la recepción de su PDF."}</p></div> :
        <ul className="divide-y divide-gray-100">{data.items.map(item => <li key={item.id}><button onClick={() => select(item.id)} className="flex w-full flex-wrap items-center gap-4 px-5 py-5 text-left transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-500 sm:flex-nowrap sm:px-6">
          <div className="min-w-0 flex-1 basis-full sm:basis-auto"><p className="break-words font-semibold">{item.nombreCompleto}</p><p className="mt-1 break-words text-sm text-gray-500">{item.profesion} · {item.ciudad}</p><p className="mt-1 break-all text-xs text-gray-400">{item.correo}</p></div>
          <div className="shrink-0"><Badge status={item.estado} /><p className="mt-2 text-xs text-gray-400">{date(item.creadoEn)}</p></div><ArrowRight className="ml-auto size-4 shrink-0 text-gray-400" />
        </button></li>)}</ul>}
    </div>
    {data && data.total > 0 && <nav aria-label="Paginación de postulaciones" className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
      <p>{data.total} resultados · Página {data.page} de {Math.max(1, Math.ceil(data.total / data.pageSize))}</p><div className="flex gap-2">
        <button aria-label="Página anterior" className={button} disabled={data.page <= 1} onClick={() => { params.set("page", String(data.page - 1)); navigate(params); }}><ArrowLeft className="size-4" />Anterior</button>
        <button aria-label="Página siguiente" className={button} disabled={data.page * data.pageSize >= data.total} onClick={() => { params.set("page", String(data.page + 1)); navigate(params); }}>Siguiente<ArrowRight className="size-4" /></button>
      </div>
    </nav>}
  </>;
}

export default function Postulaciones() {
  const [query, setQuery] = useState("");
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  return <div className="pb-8 [font-family:inherit]">
    <header className="mb-7"><h1 className="text-3xl font-semibold tracking-tight">Postulaciones</h1><p className="mt-2 text-sm leading-6 text-gray-500">Revisa los perfiles y las hojas de vida recibidas en Talento SIS.</p></header>
    <Listing key={`${query}:${revision}`} query={query} select={setSelected} navigate={params => setQuery(params.toString())} />
    {selected && <CandidateDetail key={selected} id={selected} close={() => setSelected(null)} updated={() => setRevision(value => value + 1)} />}
  </div>;
}
