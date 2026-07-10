"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { DOMParser as ProseMirrorDOMParser } from "@tiptap/pm/model";

import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Loader2,
  Trash2,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
} from "lucide-react";

import Swal from "sweetalert2";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          element.style.width ||
          element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};

          return {
            "data-width": attributes.width,
            style: `width: ${attributes.width};`,
          };
        },
      },

      dataAlign: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => {
          return {
            "data-align": attributes.dataAlign || "center",
          };
        },
      },
    };
  },
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isTabularText(text: string) {
  const trimmed = text.trim();

  if (!trimmed) return false;

  const rows = trimmed
    .split(/\r?\n/)
    .map((row) => row.trimEnd())
    .filter(Boolean);

  if (rows.length < 2) return false;

  const rowsWithTabs = rows.filter((row) => row.includes("\t"));
  if (rowsWithTabs.length < 2) return false;

  const firstColumnCount = rows[0].split("\t").length;

  return firstColumnCount > 1;
}

function textToTableHtml(text: string) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((row) => row.split("\t"));

  const maxColumns = Math.max(...rows.map((row) => row.length));

  const tableRows = rows
    .map((row) => {
      const cells = Array.from({ length: maxColumns })
        .map((_, index) => {
          const value = row[index] ?? "";
          return `<td><p>${escapeHtml(value)}</p></td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<table><tbody>${tableRows}</tbody></table><p></p>`;
}

function getFirstTableFromHtml(html: string) {
  const match = html.match(/<table[\s\S]*?<\/table>/i);
  return match ? `${match[0]}<p></p>` : html;
}

function insertHtmlIntoEditor(view: any, html: string) {
  const parser = ProseMirrorDOMParser.fromSchema(view.state.schema);

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  const slice = parser.parseSlice(wrapper, {
    preserveWhitespace: false,
  });

  const transaction = view.state.tr.replaceSelection(slice).scrollIntoView();

  view.dispatch(transaction);

  return true;
}

const MenuBar = ({
  editor,
  isFullscreen,
  onToggleFullscreen,
}: {
  editor: any;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) return null;

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];

        setIsUploading(true);

        const data = new FormData();
        data.append("file", file);
        data.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
        );
        data.append(
          "cloud_name",
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
        );

        try {
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: data,
            }
          );

          const uploadedFile = await res.json();

          if (uploadedFile.secure_url) {
            editor
              .chain()
              .focus()
              .setImage({
                src: uploadedFile.secure_url,
                dataAlign: "center",
                width: "100%",
              })
              .run();
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo subir la imagen.",
          });
        } finally {
          setIsUploading(false);
        }
      }
    };

    input.click();
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  const setImageAlign = (
    align: "left" | "center" | "right" | "left-wrap" | "right-wrap"
  ) => {
    editor.chain().focus().updateAttributes("image", { dataAlign: align }).run();
  };

  const setImageWidth = (width: string) => {
    editor.chain().focus().updateAttributes("image", { width }).run();
  };

  const btnClass = (isActive: boolean) =>
    `p-2 rounded-lg transition-colors flex items-center justify-center ${
      isActive
        ? "bg-blue-100 text-blue-600"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="sticky top-0 z-50 flex flex-wrap gap-1 p-2 bg-white/95 backdrop-blur-xl border-b border-gray-200 rounded-t-2xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
        title="Negrita"
      >
        <Bold size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
        title="Cursiva"
      >
        <Italic size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
        title="Tachado"
      >
        <Strikethrough size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <select
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;

          if (!value) {
            editor.chain().focus().unsetFontSize().run();
            return;
          }

          editor.chain().focus().setFontSize(value).run();
        }}
        className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        title="Tamaño de letra"
      >
        <option value="">Letra</option>
        <option value="14px">Pequeña</option>
        <option value="16px">Normal</option>
        <option value="18px">Media</option>
        <option value="20px">Grande</option>
        <option value="24px">Muy grande</option>
        <option value="28px">Destacada</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        title="Título H2"
      >
        <Heading2 size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
        title="Título H3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btnClass(editor.isActive({ textAlign: "left" }))}
        title="Alinear texto izquierda"
      >
        <AlignLeft size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btnClass(editor.isActive({ textAlign: "center" }))}
        title="Centrar texto"
      >
        <AlignCenter size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btnClass(editor.isActive({ textAlign: "right" }))}
        title="Alinear texto derecha"
      >
        <AlignRight size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={btnClass(editor.isActive({ textAlign: "justify" }))}
        title="Justificar texto"
      >
        <AlignJustify size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
        title="Lista"
      >
        <List size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
        title="Lista numerada"
      >
        <ListOrdered size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
        title="Cita"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <button
        type="button"
        onClick={handleImageUpload}
        disabled={isUploading}
        className={btnClass(false)}
        title="Subir imagen"
      >
        {isUploading ? (
          <Loader2 size={18} className="animate-spin text-blue-500" />
        ) : (
          <ImageIcon size={18} />
        )}
      </button>

      <button
        type="button"
        onClick={insertTable}
        className={btnClass(editor.isActive("table"))}
        title="Insertar tabla"
      >
        <TableIcon size={18} />
      </button>

      <button
        type="button"
        onClick={onToggleFullscreen}
        className={btnClass(false)}
        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      {editor.isActive("image") && (
        <div className="flex flex-wrap gap-1 bg-purple-50 p-1 rounded-lg border border-purple-100 ml-2">
          <button
            type="button"
            onClick={() => setImageAlign("left")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
            title="Imagen a la izquierda"
          >
            Img Izq
          </button>

          <button
            type="button"
            onClick={() => setImageAlign("center")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
            title="Imagen centrada"
          >
            Img Centro
          </button>

          <button
            type="button"
            onClick={() => setImageAlign("right")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
            title="Imagen a la derecha"
          >
            Img Der
          </button>

          <button
            type="button"
            onClick={() => setImageAlign("left-wrap")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
            title="Texto rodeando imagen a la izquierda"
          >
            Texto Der
          </button>

          <button
            type="button"
            onClick={() => setImageAlign("right-wrap")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
            title="Texto rodeando imagen a la derecha"
          >
            Texto Izq
          </button>

          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) setImageWidth(e.target.value);
            }}
            className="h-8 rounded-md border border-purple-100 bg-white px-2 text-[11px] font-semibold text-purple-700"
            title="Tamaño de imagen"
          >
            <option value="">Tamaño</option>
            <option value="25%">25%</option>
            <option value="40%">40%</option>
            <option value="50%">50%</option>
            <option value="75%">75%</option>
            <option value="100%">100%</option>
          </select>
        </div>
      )}

      {editor.isActive("table") && (
        <div className="flex gap-1 bg-blue-50 p-1 rounded-lg border border-blue-100 ml-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            title="Agregar columna antes"
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar columna"
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            title="Agregar fila"
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar fila"
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar tabla"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      CustomImage.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          directions: ["bottom-right"],
          minWidth: 80,
          minHeight: 80,
          alwaysPreserveAspectRatio: true,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "tiptap-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    editorProps: {
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;

        if (!clipboardData) return false;

        const html = clipboardData.getData("text/html");
        const text = clipboardData.getData("text/plain");

        if (html && /<table[\s>]/i.test(html)) {
          event.preventDefault();

          const tableHtml = getFirstTableFromHtml(html);

          return insertHtmlIntoEditor(view, tableHtml);
        }

        if (text && isTabularText(text)) {
          event.preventDefault();

          const tableHtml = textToTableHtml(text);

          return insertHtmlIntoEditor(view, tableHtml);
        }

        return false;
      },
      attributes: {
        class: "sis-prosemirror",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    const nextHTML = value || "";

    if (nextHTML && nextHTML !== currentHTML) {
      editor.commands.setContent(nextHTML, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-[9999] bg-[#F5F5F7] p-2 sm:p-4 md:p-6 flex flex-col"
          : "flex flex-col h-full min-h-[620px] border border-gray-100 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all"
      }
    >
      <div
        className={
          isFullscreen
            ? "flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
            : "flex flex-col h-full overflow-hidden"
        }
      >
        <MenuBar
          editor={editor}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        />

        <div
          className={
            isFullscreen
              ? "flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 bg-white prose max-w-none tiptap-content"
              : "flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-white prose max-w-none tiptap-content"
          }
        >
          <EditorContent
            editor={editor}
            className="min-h-[520px] h-full outline-none"
          />
        </div>
      </div>

      <style jsx global>{`
        .tiptap-content .ProseMirror {
          outline: none !important;
          min-height: 520px;
          font-size: 18px;
          line-height: 1.75;
          color: #1d1d1f;
          padding-bottom: 8rem;
        }

        .tiptap-content .ProseMirror::after {
          content: "";
          display: block;
          clear: both;
        }

        .tiptap-content .ProseMirror p {
          margin-bottom: 1rem;
        }

        .tiptap-content .ProseMirror h2 {
          font-size: 1.75rem;
          line-height: 1.25;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .tiptap-content .ProseMirror h3 {
          font-size: 1.35rem;
          line-height: 1.3;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .tiptap-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        .tiptap-content img {
          max-width: 100%;
          height: auto;
          border-radius: 14px;
          margin: 1.5rem auto;
          display: block;
          border: 1px solid #f0f0f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          cursor: pointer;
        }

        .tiptap-content img.ProseMirror-selectednode {
          outline: 3px solid #007aff;
          outline-offset: 4px;
        }

        .tiptap-content img[data-align="left"] {
          margin-left: 0;
          margin-right: auto;
        }

        .tiptap-content img[data-align="center"] {
          margin-left: auto;
          margin-right: auto;
        }

        .tiptap-content img[data-align="right"] {
          margin-left: auto;
          margin-right: 0;
        }

        .tiptap-content img[data-align="left-wrap"] {
          float: left;
          width: 40%;
          margin: 0.5rem 1.5rem 1rem 0;
        }

        .tiptap-content img[data-align="right-wrap"] {
          float: right;
          width: 40%;
          margin: 0.5rem 0 1rem 1.5rem;
        }

        .tiptap-content table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5rem 0;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 0 0 1px #e5e7eb;
          font-size: 0.95rem;
        }

        .tiptap-content td,
        .tiptap-content th {
          min-width: 1em;
          border: 1px solid #e5e7eb;
          padding: 12px 16px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .tiptap-content th {
          font-weight: 600;
          text-align: left;
          background-color: #f9fafb;
        }

        .tiptap-content .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }

        .tiptap-content .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }

        .tiptap-content .resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }

        @media (max-width: 640px) {
          .tiptap-content .ProseMirror {
            font-size: 16px;
            line-height: 1.65;
          }

          .tiptap-content img[data-align="left-wrap"],
          .tiptap-content img[data-align="right-wrap"] {
            float: none;
            width: 100% !important;
            margin: 1.5rem auto;
          }
        }
      `}</style>
    </div>
  );
}