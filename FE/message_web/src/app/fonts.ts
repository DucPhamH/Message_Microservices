import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";

export const fontSans = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
