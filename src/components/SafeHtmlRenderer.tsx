import DOMPurify from "dompurify"
import parse, { domToReact, Element, type HTMLReactParserOptions } from "html-react-parser"
import React from "react"

interface SafeHtmlRendererProps {
  html: string
  className?: string
}

export const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ html, className = "" }) => {
  if (!html) return null

  const sanitized = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  })

  // Custom parsing options to preserve empty paragraphs and handle link clicks
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === "a" && domNode.attribs.href) {
          const { href, target, rel, ...rest } = domNode.attribs
          return (
            <a
              href={href}
              target={target || "_blank"}
              rel={rel || "noopener noreferrer"}
              {...rest}
              onClick={(e) => {
                e.preventDefault()
                window.open(href, "_blank", "noopener,noreferrer")
              }}
            >
              {domToReact(domNode.children as any, options)}
            </a>
          )
        }
        if (domNode.name === "p" && domNode.children.length === 0) {
          return <p><br /></p>
        }
      }
    },
  }

  const parsedContent = parse(sanitized, options)

  return (
    <div className={`prose max-w-none [&_img]:inline-block [&_img]:h-auto ${className}`}>
      {parsedContent}
    </div>
  )
}
