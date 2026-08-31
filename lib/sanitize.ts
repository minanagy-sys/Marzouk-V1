import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes rich-text HTML authored in the admin (blog/case/service bodies)
 * before it is rendered with dangerouslySetInnerHTML. Removes <script>, event
 * handlers, javascript: URLs, iframes, etc., while keeping the formatting the
 * editor produces (headings, lists, links, images, emphasis, alignment).
 *
 * Runs server-side only (called from the data layer), so the sanitizer is never
 * shipped to the browser.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "span", "div", "blockquote", "pre", "code",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "strong", "b", "em", "i", "u", "s", "sub", "sup", "mark",
    "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading", "class"],
    span: ["class"],
    div: ["class"],
    p: ["class"],
    figure: ["class"],
    "*": ["style"],
  },
  // Only safe URL schemes; blocks javascript:, data: (except images), etc.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Keep relative URLs (e.g. /uploads/… and internal links like /ar/blogs/…).
  allowProtocolRelative: false,
  // Restrict inline styles to a safe, presentational subset.
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      "font-size": [/^\d{1,3}(px|em|rem|%)$/],
      "font-weight": [/^(normal|bold|[1-9]00)$/],
      color: [/^#(0x)?[0-9a-fA-F]{3,8}$/, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/],
      width: [/^\d{1,3}(px|%)$/],
    },
  },
  // Force safe rel on links that open a new tab.
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") attribs.rel = "noopener noreferrer";
      return { tagName, attribs };
    },
  },
};

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, OPTIONS);
}
