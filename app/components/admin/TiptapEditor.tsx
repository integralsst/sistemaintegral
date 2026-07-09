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
} from "lucide-react";

import Swal from "sweetalert2";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

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

const MenuBar = ({ editor }: { editor: any }) => {
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

  const btnClass = (isActive: boolean) =>
    `p-2 rounded-lg transition-colors flex items-center justify-center ${
      isActive
        ? "bg-blue-100 text-blue-600"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-2xl">
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
        title="Alinear izquierda"
      >
        <AlignLeft size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btnClass(editor.isActive({ textAlign: "center" }))}
        title="Centrar"
      >
        <AlignCenter size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btnClass(editor.isActive({ textAlign: "right" }))}
        title="Alinear derecha"
      >
        <AlignRight size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={btnClass(editor.isActive({ textAlign: "justify" }))}
        title="Justificar"
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
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({
        inline: false,
        allowBase64: false,
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

        // Google Docs normalmente pega tablas como HTML.
        if (html && /<table[\s>]/i.test(html)) {
          event.preventDefault();

          const tableHtml = getFirstTableFromHtml(html);

          return insertHtmlIntoEditor(view, tableHtml);
        }

        // Google Sheets y Excel muchas veces pegan como texto tabulado.
        if (text && isTabularText(text)) {
          event.preventDefault();

          const tableHtml = textToTableHtml(text);

          return insertHtmlIntoEditor(view, tableHtml);
        }

        return false;
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

  return (
    <div className="flex flex-col h-full border border-gray-100 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
      <MenuBar editor={editor} />

      <div className="flex-1 overflow-y-auto p-6 bg-white prose max-w-none tiptap-content">
        <EditorContent
          editor={editor}
          className="min-h-[400px] h-full outline-none"
        />
      </div>

      <style jsx global>{`
        .tiptap-content .ProseMirror {
          outline: none !important;
          min-height: 400px;
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
          border-radius: 12px;
          margin: 1.5rem auto;
          display: block;
          border: 1px solid #f0f0f0;
        }

        .tiptap-content table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5rem 0;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 0 0 1px #e5e7eb;
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
      `}</style>
    </div>
  );
}