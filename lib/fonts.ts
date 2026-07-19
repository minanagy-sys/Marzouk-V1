import { El_Messiri, Tajawal } from "next/font/google";

// Fonts loaded/optimized by Next — exposed as CSS variables used across the site.
export const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: "swap",
});

export const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const fontVars = `${elMessiri.variable} ${tajawal.variable}`;
