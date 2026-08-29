import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * IRANYekan Web, per the brand sheet. Self-hosted rather than pulled from a CDN
 * so the page controls its own loading and there is no third-party request on
 * first paint. Sources are the `fanum` cuts, which carry Persian numerals.
 *
 * The family has no SemiBold, so 600 maps to Bold — 600 is what the buttons and
 * labels use, and Medium there reads too light against the 18px body.
 *
 * Only the weights the page actually sets are shipped (400/500/600/700/800);
 * Light and Black were 50KB of font nothing referenced.
 */
const iranYekan = localFont({
  variable: "--font-yekan",
  display: "swap",
  fallback: ["Vazirmatn", "ui-sans-serif", "system-ui", "sans-serif"],
  src: [
    { path: "../fonts/IRANYekan-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/IRANYekan-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/IRANYekan-700.woff2", weight: "600", style: "normal" },
    { path: "../fonts/IRANYekan-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/IRANYekan-800.woff2", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "کتاپاد | کتاب صوتی هوشمند، متناسب با هر شنونده",
  description:
    "پیشنهادهای هوشمند، تجربه شنیداری تعاملی، حالت کودک و انتخاب صدا در یک تجربه یکپارچه.",
  metadataBase: new URL("https://ketapod.ir"),
  openGraph: {
    title: "کتاپاد | کتاب صوتی هوشمند، متناسب با هر شنونده",
    description:
      "پیشنهادهای هوشمند، تجربه شنیداری تعاملی، حالت کودک و انتخاب صدا در یک تجربه یکپارچه.",
    locale: "fa_IR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9f9f7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${iranYekan.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
