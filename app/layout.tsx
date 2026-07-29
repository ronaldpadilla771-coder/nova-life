import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nova Life",
  description: "Tu vida, organizada. Objetivos, hábitos, diario, tareas y finanzas en un solo lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
