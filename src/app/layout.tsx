import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Familjen_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollMotion } from "@/components/ScrollMotion";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const serif = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Familjen_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "NOIR · Restaurant, Lyon",
  description:
    "NOIR is a fictional fine dining restaurant in Lyon: seven courses served after dark in a seventeenth-century silk workshop. A concept website by LeoDex.",
  openGraph: {
    title: "NOIR · Restaurant, Lyon",
    description: "An experience that begins long before the first taste. A concept website by LeoDex.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
};

const motionFlag = `if(matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteHeader />
        {children}
        <ScrollMotion />
      </body>
    </html>
  );
}
