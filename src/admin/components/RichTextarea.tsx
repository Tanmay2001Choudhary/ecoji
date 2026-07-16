import { Blockquote } from "@tiptap/extension-blockquote"
import { BulletList } from "@tiptap/extension-bullet-list"
import { Color } from "@tiptap/extension-color"
import { Heading, type Level } from "@tiptap/extension-heading"
import { HorizontalRule } from "@tiptap/extension-horizontal-rule"
import { Image } from "@tiptap/extension-image"
import { Link } from "@tiptap/extension-link"
import { OrderedList } from "@tiptap/extension-ordered-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Underline } from "@tiptap/extension-underline"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
  useEditor,
  EditorContent
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React, { useEffect, useRef, useState } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Type,
  Underline as UnderlineIcon
} from "lucide-react"

const CustomHeading = Heading.extend({
  addOptions(): any {
    return {
      ...(this.parent?.() as any),
      levels: [1, 2, 3] as Level[],
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as Level
    const tailwindClasses = {
      1: "text-2xl sm:text-3xl font-bold my-4 text-gray-900",
      2: "text-xl sm:text-2xl font-semibold my-3 text-gray-800",
      3: "text-lg sm:text-xl font-medium my-2 text-gray-800",
    }

    return [
      `h${level}`,
      {
        ...HTMLAttributes,
        class: `${HTMLAttributes.class || ""} ${(tailwindClasses as any)[level] || ""}`.trim(),
      },
      0,
    ]
  },
})

const CustomBulletList = BulletList.extend({
  addOptions(): any {
    return {
      ...(this.parent?.() as any),
      keepMarks: true,
      keepAttributes: false,
    }
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      {
        ...HTMLAttributes,
        class: `${HTMLAttributes.class || ""} list-disc pl-6 my-2 space-y-1`.trim(),
      },
      0,
    ]
  },
})

const CustomOrderedList = OrderedList.extend({
  addOptions(): any {
    return {
      ...(this.parent?.() as any),
      keepMarks: true,
      keepAttributes: false,
    }
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ol",
      {
        ...HTMLAttributes,
        class: `${HTMLAttributes.class || ""} list-decimal pl-6 my-2 space-y-1`.trim(),
      },
      0,
    ]
  },
})

const CustomBlockquote = Blockquote.extend({
  addOptions(): any {
    return {
      ...(this.parent?.() as any),
    }
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      {
        ...HTMLAttributes,
        class: `${HTMLAttributes.class || ""} border-l-4 border-primary/60 pl-4 my-4 italic text-gray-600 bg-gray-50 py-2 rounded-r`.trim(),
      },
      0,
    ]
  },
})

const CustomLink = Link.extend({
  addOptions(): any {
    return {
      ...(this.parent?.() as any),
      openOnClick: false,
      HTMLAttributes: {
        class: "text-blue-600 underline cursor-pointer hover:text-blue-800",
        target: "_blank",
        rel: "noopener noreferrer",
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      new Plugin({
        key: new PluginKey("handleClickLink"),
        props: {
          handleClick: (view, _pos, event) => {
            const { doc } = view.state
            const clickPos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })

            if (!clickPos) return false

            const $pos = doc.resolve(clickPos.pos)
            const linkMark = $pos.marks().find((mark) => mark.type.name === "link")

            if (linkMark && linkMark.attrs.href) {
              event.preventDefault()
              window.open(linkMark.attrs.href, "_blank", "noopener,noreferrer")
              return true
            }

            return false
          },
        },
      }),
    ]
  },
})

function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, href, width, alt, align } = node.attrs
  const [editHref, setEditHref] = useState<string>(href || "")
  const [editWidth, setEditWidth] = useState<string>(width || "")
  const [panelFocused, setPanelFocused] = useState(false)

  useEffect(() => {
    setEditHref(href || "")
    setEditWidth(width || "")
  }, [href, width])

  const applyHref = () => updateAttributes({ href: editHref || null })
  const applyWidth = () => updateAttributes({ width: editWidth || null })

  const showPanel = selected || panelFocused

  const imgEl = (
    <img
      src={src}
      alt={alt || ""}
      className={`rounded${href ? " cursor-pointer" : ""}`}
      style={width ? { width, maxWidth: "100%" } : { maxWidth: "100%", height: "auto" }}
    />
  )

  return (
    <NodeViewWrapper contentEditable={false}>
      <div
        className={`flex my-2 ${
          align === "center"
            ? "justify-center"
            : align === "right"
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`relative inline-block${
            showPanel ? " ring-2 ring-blue-400 ring-offset-1 rounded" : ""
          }`}
        >
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault()
                window.open(href, "_blank", "noopener,noreferrer")
              }}
            >
              {imgEl}
            </a>
          ) : (
            imgEl
          )}

          {showPanel && (
            <div
              data-image-panel
              className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 flex flex-col gap-2 text-xs"
              style={{ top: "calc(100% + 6px)", left: 0, minWidth: "260px" }}
              onFocus={() => setPanelFocused(true)}
              onBlur={() => setPanelFocused(false)}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-10 shrink-0">Align</span>
                <div className="flex gap-1">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        updateAttributes({ align: a })
                      }}
                      className={`p-1 rounded hover:bg-gray-100 ${
                        (align || "left") === a ? "bg-blue-100 text-blue-600" : "text-gray-500"
                      }`}
                      title={a.charAt(0).toUpperCase() + a.slice(1)}
                    >
                      {a === "left" ? (
                        <AlignLeft className="h-3.5 w-3.5" />
                      ) : a === "center" ? (
                        <AlignCenter className="h-3.5 w-3.5" />
                      ) : (
                        <AlignRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-10 shrink-0">Link</span>
                <input
                  type="text"
                  value={editHref}
                  onChange={(e) => setEditHref(e.target.value)}
                  onBlur={applyHref}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === "Enter") applyHref()
                  }}
                  placeholder="https://..."
                  className="flex-1 border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-10 shrink-0">Width</span>
                <input
                  type="text"
                  value={editWidth}
                  onChange={(e) => setEditWidth(e.target.value)}
                  onBlur={applyWidth}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === "Enter") applyWidth()
                  }}
                  placeholder="e.g. 300px or 50%"
                  className="flex-1 border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: (element) => {
          const parent = element.parentElement
          return parent?.tagName === "A" ? parent.getAttribute("href") : null
        },
        renderHTML: () => ({}),
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width") || element.style.width || null,
        renderHTML: () => ({}),
      },
      align: {
        default: "left",
        parseHTML: (element) => {
          const ml = element.style.marginLeft
          const mr = element.style.marginRight
          if (ml === "auto" && mr === "auto") return "center"
          if (ml === "auto") return "right"
          return "left"
        },
        renderHTML: () => ({}),
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const href: string | null = node.attrs.href
    const width: string | null = node.attrs.width
    const align: string = node.attrs.align || "left"

    const marginStyle =
      align === "center"
        ? "display: block; margin-left: auto; margin-right: auto;"
        : align === "right"
        ? "display: block; margin-left: auto; margin-right: 0;"
        : "display: block; margin-left: 0; margin-right: auto;"

    const imgAttrs: any = {
      ...HTMLAttributes,
      class: "rounded my-2",
      style: `${marginStyle}${width ? ` width: ${width};` : ""} max-width: 100%;`,
    }
    const imgEl: any = ["img", imgAttrs]
    if (href) {
      return ["a", { href, target: "_blank", rel: "noopener noreferrer" }, imgEl]
    }
    return imgEl
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView, {
      stopEvent: ({ event }) => {
        const target = event.target as HTMLElement
        return !!target.closest("[data-image-panel]")
      },
    })
  },
})

const TabExtension = Extension.create({
  name: "tabIndent",
  addKeyboardShortcuts() {
    return {
      Tab: () =>
        this.editor.commands.sinkListItem("listItem") ||
        this.editor.commands.insertContent("\u00A0\u00A0\u00A0\u00A0"),
      "Shift-Tab": () => this.editor.commands.liftListItem("listItem"),
    }
  },
})

export const TiptapEditor: React.FC<{
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  uploadImage?: (file: File) => Promise<string>
  minHeight?: string
}> = ({
  value = "",
  onChange,
  placeholder = "Write content here...",
  uploadImage,
  minHeight = "min-h-[140px]"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
        heading: false,
        horizontalRule: false,
        listItem: {
          HTMLAttributes: {
            class: "list-item leading-relaxed",
          },
        },
      }),
      CustomHeading,
      CustomBulletList,
      CustomOrderedList,
      CustomBlockquote,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      CustomLink,
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "border-t-2 border-gray-300 my-4",
        },
      }),
      CustomImage.configure({ inline: false, allowBase64: true }),
      TabExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose max-w-none focus:outline-none ${minHeight} p-3 text-sm text-gray-800`,
        "data-placeholder": placeholder,
        spellcheck: "false",
      },
    },
  })

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      if (!value || (editor.getText() === '' && value !== '')) {
        editor.commands.setContent(value, { emitUpdate: false })
      }
    }
  }, [value, editor])

  const handleInsertImage = () => {
    if (uploadImage) {
      fileInputRef.current?.click()
    } else {
      const src = window.prompt("Image URL:")
      if (!src) return
      editor?.chain().focus().setImage({ src } as any).run()
    }
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    try {
      if (uploadImage) {
        const src = await uploadImage(file)
        editor?.chain().focus().setImage({ src } as any).run()
      }
    } finally {
      setIsUploadingImage(false)
      e.target.value = ""
    }
  }

  const addLink = () => {
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("Enter URL:", previousUrl)

    if (url === null) return
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const isHeadingActive = (level: number) => {
    return editor?.isActive("heading", { level })
  }

  const isParagraphActive = () => {
    return editor?.isActive("paragraph") && !editor?.isActive("heading")
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[140px] animate-pulse bg-gray-50 text-xs text-gray-400">
        Loading rich editor...
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
      <div className="border-b border-gray-200 p-1.5 flex flex-wrap items-center gap-1 bg-gray-50 text-gray-700">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-blue-100 text-blue-700 font-bold" : ""
          }`}
          type="button"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("underline") ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("strike") ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-0.5" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            isHeadingActive(1) ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            isHeadingActive(2) ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            isHeadingActive(3) ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().clearNodes().setParagraph().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            isParagraphActive() ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Normal Text"
        >
          <Type className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-0.5" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-0.5" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("orderedList") ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-0.5" />

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={!editor.can().chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          type="button"
          title="Horizontal Line"
        >
          <Minus className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("blockquote") ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-0.5" />

        <button
          onClick={addLink}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("link") ? "bg-blue-100 text-blue-700" : ""
          }`}
          type="button"
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <button
          onClick={handleInsertImage}
          disabled={isUploadingImage}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
          type="button"
          title={uploadImage ? "Upload Image" : "Insert Image URL"}
        >
          {isUploadingImage ? (
            <span className="text-xs">...</span>
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelected}
        />

        <div className="w-px h-5 bg-gray-300 mx-0.5" />

        <input
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()
          }
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer rounded"
          title="Text Color"
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

interface RichTextareaProps {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  className?: string
  required?: boolean
  id?: string
  name?: string
  uploadImage?: (file: File) => Promise<string>
}

export const RichTextarea: React.FC<RichTextareaProps> = ({
  value = '',
  onChange,
  rows = 3,
  placeholder = 'Write rich content...',
  className = '',
  uploadImage
}) => {
  const minHeight = rows && rows > 3 ? `min-h-[${rows * 40}px]` : 'min-h-[140px]'
  return (
    <div className={className}>
      <TiptapEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        uploadImage={uploadImage}
        minHeight={minHeight}
      />
    </div>
  )
}
