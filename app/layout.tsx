import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClearView AI — Understand Any Website in Seconds",
  description:
    "AI-powered website simplification, structure visualization, readability insights, and clutter detection. See any website clearly.",
  keywords: [
    "AI website analyzer",
    "website simplification",
    "readability analysis",
    "clutter detection",
    "structure visualization",
  ],
  openGraph: {
    title: "ClearView AI — Understand Any Website in Seconds",
    description:
      "AI-powered website simplification and structure visualization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      >
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
