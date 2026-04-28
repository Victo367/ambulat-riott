import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ambulatório — Pacientes",
  description: "Cadastro de pacientes do ambulatório",
};

// 👇 AQUI MUDA
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromRequest();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <Sidebar user={user ?? null} />

        <main className="flex-1 bg-gray-100 p-8 overflow-y-auto ml-64">
          {children}
        </main>
      </body>
    </html>
  );
}
