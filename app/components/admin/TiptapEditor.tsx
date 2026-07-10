"use client";

import { useEffect, useState } from "react";
import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
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

type ImageAlign = "left" | "center" | "right" | "left-wrap" | "right-wrap";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, "&#096;");
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

function getImageWrapperStyle(width: string, align: ImageAlign) {
  const base: React.CSSProperties = {
    width: width || "100%",
    maxWidth: "100%",
    position: "relative",
  };

  if (align === "left") {
    return {
      ...base,
      display: "block",
      margin: "1.5rem auto 1.5rem 0",
      float: "none",
      clear: "both",
    };
  }

  if (align === "center") {
    return {
      ...base,
      display: "block",
      margin: "1.5rem auto",
      float: "none",
      clear: "both",
    };
  }

  if (align === "right") {
    return {
      ...base,
      display: "block",
      margin: "1.5rem 0 1.5rem auto",
      float: "none",
      clear: "both",
    };
  }

  if (align === "left-wrap") {
    return {
      ...base,
      float: "left" as const,
      margin: "0.5rem 1.5rem 1rem 0",
      clear: "none",
    };
  }

  if (align === "right-wrap") {
    return {
      ...base,
      float: "right" as const,
      margin: "0.5rem 0 1rem 1.5rem",
      clear: "none",
    };
  }

  return base;
}

const ResizableImageView = (props: any) => {
  const { node, updateAttributes, selected, editor, getPos } = props;

  const src = node.attrs.src;
  const alt = node.attrs.alt || "";
  const title = node.attrs.title || "";
  const width = node.attrs.width || "100%";
  const align = (node.attrs.dataAlign || "center") as ImageAlign;

  const selectImage = (event: React.MouseEvent) => {
    event.preventDefault();

    if (typeof getPos === "function") {
      const pos = getPos();
      editor.commands.setNodeSelection(pos);
    }
  };

  const setWidth = (nextWidth: string) => {
    updateAttributes({
      width: nextWidth,
    });
  };

  const setAlign = (nextAlign: ImageAlign) => {
    updateAttributes({
      dataAlign: nextAlign,
    });
  };

  const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const wrapper = event.currentTarget.parentElement as HTMLElement | null;
    const editorElement = wrapper?.closest(".ProseMirror") as HTMLElement | null;

    if (!wrapper || !editorElement) return;

    const startX = event.clientX;
    const startWidth = wrapper.getBoundingClientRect().width;
    const maxWidth = editorElement.getBoundingClientRect().width;

    const onMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextPx = Math.max(80, Math.min(startWidth + delta, maxWidth));
      const nextPercent = Math.round((nextPx / maxWidth) * 100);

      updateAttributes({
        width: `${Math.max(15, Math.min(nextPercent, 100))}%`,
      });
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  return (
    <NodeViewWrapper
      as="div"
      className={`sis-image-node ${selected ? "is-selected" : ""}`}
      data-align={align}
      data-width={width}
      style={getImageWrapperStyle(width, align)}
      contentEditable={false}
      onClick={selectImage}
    >
      {selected && (
        <div
          className="sis-image-floating-toolbar"
          contentEditable={false}
          onMouseDown={(event) => event.preventDefault()}
        >
          <button type="button" onClick={() => setWidth("25%")}>
            25%
          </button>
          <button type="button" onClick={() => setWidth("40%")}>
            40%
          </button>
          <button type="button" onClick={() => setWidth("50%")}>
            50%
          </button>
          <button type="button" onClick={() => setWidth("75%")}>
            75%
          </button>
          <button type="button" onClick={() => setWidth("100%")}>
            100%
          </button>

          <span />

          <button type="button" onClick={() => setAlign("left")}>
            Izq
          </button>
          <button type="button" onClick={() => setAlign("center")}>
            Centro
          </button>
          <button type="button" onClick={() => setAlign("right")}>
            Der
          </button>
          <button type="button" onClick={() => setAlign("left-wrap")}>
            Texto der
          </button>
          <button type="button" onClick={() => setAlign("right-wrap")}>
            Texto izq
          </button>
        </div>
      )}

      <img src={src} alt={alt} title={title} draggable={false} />

      {selected && (
        <div
          className="sis-image-resize-handle"
          contentEditable={false}
          onPointerDown={startResize}
          title="Arrastra para redimensionar"
        />
      )}
    </NodeViewWrapper>
  );
};

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          element.style.width ||
          element.getAttribute("width") ||
          "100%",
        renderHTML: (attributes) => {
          const width = attributes.width || "100%";

          return {
            "data-width": width,
            style: `width: ${width};`,
          };
        },
      },

      dataAlign: {
        default: "center",
        parseHTML: (element) =>
          element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => {
          return {
            "data-align": attributes.dataAlign || "center",
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});

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

  const buttonBase = (isActive: boolean) =>
    `p-2 rounded-lg transition-colors flex items-center justify-center ${
      isActive
        ? "bg-blue-100 text-blue-600"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const preventBlur = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const insertImageFromUrl = (src: string) => {
    const safeSrc = escapeAttribute(src);

    editor
      .chain()
      .focus()
      .insertContent(
        `<img src="${safeSrc}" data-align="center" data-width="100%" style="width: 100%;" />`
      )
      .run();
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (!input.files?.length) return;

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
          insertImageFromUrl(uploadedFile.secure_url);
        } else {
          throw new Error("No secure_url returned");
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

  const setImageAlign = (align: ImageAlign) => {
    editor.chain().focus().updateAttributes("image", { dataAlign: align }).run();
  };

  const setImageWidth = (width: string) => {
    editor.chain().focus().updateAttributes("image", { width }).run();
  };

  return (
    <div className="sticky top-0 z-50 flex flex-wrap gap-1 p-2 bg-white/95 backdrop-blur-xl border-b border-gray-200 rounded-t-2xl">
      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonBase(editor.isActive("bold"))}
        title="Negrita"
      >
        <Bold size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonBase(editor.isActive("italic"))}
        title="Cursiva"
      >
        <Italic size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonBase(editor.isActive("strike"))}
        title="Tachado"
      >
        <Strikethrough size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <select
        defaultValue=""
        onChange={(event) => {
          const value = event.target.value;

          if (!value) {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(value).run();
          }
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
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonBase(editor.isActive("heading", { level: 2 }))}
        title="Título H2"
      >
        <Heading2 size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonBase(editor.isActive("heading", { level: 3 }))}
        title="Título H3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={buttonBase(editor.isActive({ textAlign: "left" }))}
        title="Alinear texto izquierda"
      >
        <AlignLeft size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={buttonBase(editor.isActive({ textAlign: "center" }))}
        title="Centrar texto"
      >
        <AlignCenter size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={buttonBase(editor.isActive({ textAlign: "right" }))}
        title="Alinear texto derecha"
      >
        <AlignRight size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={buttonBase(editor.isActive({ textAlign: "justify" }))}
        title="Justificar texto"
      >
        <AlignJustify size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonBase(editor.isActive("bulletList"))}
        title="Lista"
      >
        <List size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonBase(editor.isActive("orderedList"))}
        title="Lista numerada"
      >
        <ListOrdered size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonBase(editor.isActive("blockquote"))}
        title="Cita"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={handleImageUpload}
        disabled={isUploading}
        className={buttonBase(false)}
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
        onMouseDown={preventBlur}
        onClick={insertTable}
        className={buttonBase(editor.isActive("table"))}
        title="Insertar tabla"
      >
        <TableIcon size={18} />
      </button>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={onToggleFullscreen}
        className={buttonBase(false)}
        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      {editor.isActive("image") && (
        <div className="flex flex-wrap gap-1 bg-purple-50 p-1 rounded-lg border border-purple-100 ml-2">
          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageAlign("left")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            Img Izq
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageAlign("center")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            Img Centro
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageAlign("right")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            Img Der
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageAlign("left-wrap")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            Texto der
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageAlign("right-wrap")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            Texto izq
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageWidth("25%")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            25%
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageWidth("40%")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            40%
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageWidth("50%")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            50%
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageWidth("75%")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            75%
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => setImageWidth("100%")}
            className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 hover:bg-purple-100 rounded-md"
          >
            100%
          </button>
        </div>
      )}

      {editor.isActive("table") && (
        <div className="flex gap-1 bg-blue-50 p-1 rounded-lg border border-blue-100 ml-2">
          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            title="Agregar columna antes"
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar columna"
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            title="Agregar fila"
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar fila"
          >
            <Minus size={16} />
          </button>

          <button
            type="button"
            onMouseDown={preventBlur}
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
          return insertHtmlIntoEditor(view, getFirstTableFromHtml(html));
        }

        if (text && isTabularText(text)) {
          event.preventDefault();
          return insertHtmlIntoEditor(view, textToTableHtml(text));
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

        .sis-image-node {
          box-sizing: border-box;
          max-width: 100%;
          position: relative;
        }

        .sis-image-node img {
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 14px;
          display: block;
          border: 1px solid #f0f0f0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          user-select: none;
        }

        .sis-image-node.is-selected img {
          outline: 3px solid #007aff;
          outline-offset: 4px;
        }

        .sis-image-floating-toolbar {
          position: absolute;
          left: 50%;
          top: -46px;
          transform: translateX(-50%);
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
          white-space: nowrap;
        }

        .sis-image-floating-toolbar button {
          font-size: 11px;
          font-weight: 700;
          color: #374151;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 4px 7px;
          border-radius: 8px;
          transition: all 0.15s ease;
        }

        .sis-image-floating-toolbar button:hover {
          background: #eef2ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }

        .sis-image-floating-toolbar span {
          width: 1px;
          height: 20px;
          background: #e5e7eb;
          margin: 0 2px;
        }

        .sis-image-resize-handle {
          position: absolute;
          right: -9px;
          bottom: -9px;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #007aff;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          cursor: nwse-resize;
          z-index: 30;
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

          .sis-image-node[data-align="left-wrap"],
          .sis-image-node[data-align="right-wrap"] {
            float: none !important;
            width: 100% !important;
            margin: 1.5rem auto !important;
          }

          .sis-image-floating-toolbar {
            position: static;
            transform: none;
            margin-bottom: 0.75rem;
            overflow-x: auto;
            max-width: 100%;
            justify-content: flex-start;
          }
        }
          .tiptap-content .ProseMirror ul {
  list-style-type: disc !important;
  padding-left: 1.75rem !important;
  margin: 1rem 0 !important;
}

.tiptap-content .ProseMirror ol {
  list-style-type: decimal !important;
  padding-left: 1.75rem !important;
  margin: 1rem 0 !important;
}

.tiptap-content .ProseMirror li {
  display: list-item !important;
  margin-bottom: 0.5rem !important;
  padding-left: 0.25rem;
}

.tiptap-content .ProseMirror li p {
  margin: 0 !important;
}
      `}</style>
    </div>
  );
}