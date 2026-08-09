import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House Management",
  description: "Kelola keuangan, maintenance, kalender, dan link penting rumah tangga.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-dvh text-slate-800 antialiased">
        <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 pb-10 shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
