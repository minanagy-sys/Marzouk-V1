import type { MetadataRoute } from "next";

// Web app manifest (served at /manifest.webmanifest). Next injects the
// <link rel="manifest"> automatically. Icons point to the brand logo; the
// browser scales it for home-screen / install prompts.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dr. Ahmed Marzouk — Obstetrics & Gynecology",
    short_name: "Dr. Ahmed Marzouk",
    description:
      "Consultant of obstetrics, gynecology & oncologic surgery — pioneer of pain-free delivery in Egypt.",
    start_url: "/ar",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1E92B8",
    icons: [
      { src: "/brand/logo.png", sizes: "1080x1080", type: "image/png", purpose: "any" },
      { src: "/brand/logo.png", sizes: "1080x1080", type: "image/png", purpose: "maskable" },
    ],
  };
}
