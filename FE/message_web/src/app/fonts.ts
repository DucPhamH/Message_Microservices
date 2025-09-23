import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";

export const fontSans = JetBrains_Mono({
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const fontMono = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  display: "swap",
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mono",
});
