"use client";

import HoverBox from "./HoverBox";
import { CONTACT_INFO } from "@/lib/content/common";

// Floating WhatsApp button, fixed bottom corner — identical to the original.
export default function WhatsappFloat() {
  return (
    <HoverBox
      as="a"
      href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      style={{
        position: "fixed",
        bottom: 28,
        insetInlineEnd: 28,
        zIndex: 200,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 30px rgba(37,211,102,0.45)",
        animation: "damFloat 4s ease-in-out infinite",
      }}
      hoverStyle={{ transform: "scale(1.08)" }}
    >
      <svg width="30" height="30" viewBox="0 0 32 32" fill="#ffffff">
        <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6 0.8 5 2.3 7L4.5 28l6.3-1.7c1.9 1 4 1.6 6.2 1.6 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm5.9 16.9c-0.3 0.8-1.5 1.5-2.4 1.7-0.6 0.1-1.4 0.2-4.1-0.9-3.4-1.4-5.6-4.9-5.8-5.1-0.2-0.2-1.4-1.9-1.4-3.6s0.9-2.5 1.2-2.9c0.3-0.3 0.7-0.4 0.9-0.4h0.6c0.2 0 0.5-0.1 0.7 0.6 0.3 0.7 0.9 2.4 1 2.5 0.1 0.2 0.1 0.4 0 0.6-0.1 0.2-0.2 0.4-0.4 0.6-0.2 0.2-0.4 0.5-0.5 0.6-0.2 0.2-0.4 0.4-0.2 0.7 0.2 0.4 0.9 1.6 2 2.5 1.4 1.2 2.5 1.6 2.9 1.8 0.4 0.2 0.6 0.1 0.8-0.1 0.2-0.2 0.9-1 1.1-1.4 0.2-0.4 0.5-0.3 0.8-0.2 0.3 0.1 2 0.9 2.3 1.1 0.3 0.2 0.6 0.3 0.6 0.4 0.1 0.3 0.1 0.9-0.2 1.5z" />
      </svg>
    </HoverBox>
  );
}
