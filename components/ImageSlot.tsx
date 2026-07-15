import { CSSProperties } from "react";

type ImageSlotProps = {
  src?: string;
  alt?: string;
  shape?: "rect" | "circle";
  placeholder?: string;
  style?: CSSProperties;
  objectPosition?: string;
};

/**
 * Replacement for the original <image-slot> web component.
 * - With `src`: shows the photo (cover-fit).
 * - Without `src`: shows a branded placeholder, ready to receive a real
 *   image later (uploaded/edited via the admin dashboard → Supabase URL).
 */
export default function ImageSlot({
  src,
  alt = "",
  shape = "rect",
  placeholder = "",
  style,
  objectPosition = "center",
}: ImageSlotProps) {
  const radius = shape === "circle" ? "50%" : undefined;

  return (
    <span
      style={{
        display: "block",
        overflow: "hidden",
        borderRadius: radius,
        position: "relative",
        ...style,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            display: "block",
          }}
        />
      ) : (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background:
              "linear-gradient(160deg, rgba(10,57,80,0.55), rgba(14,83,114,0.35))",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "var(--font-tajawal), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            textAlign: "center",
            padding: 12,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="8.5" cy="9.5" r="1.8" />
            <path d="M21 16l-5-5-9 9" />
          </svg>
          {placeholder ? <span>{placeholder}</span> : null}
        </span>
      )}
    </span>
  );
}
