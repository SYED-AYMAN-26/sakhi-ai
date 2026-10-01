import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sakhi AI — உங்கள் டிஜிட்டல் நண்பன்",
  description:
    "A voice-first digital navigator that helps first-time rural women internet users access verified government services in their own language.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f5c4c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <body>{children}</body>
    </html>
  );
}
