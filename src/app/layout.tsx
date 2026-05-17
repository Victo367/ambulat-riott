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
      {/* Aqui aplicamos o bg-slate-100 (cinza claro) que vai destacar os cards brancos */}
      <body className="min-h-full flex bg-slate-100 text-slate-800">
        <Sidebar user={user ?? null} />

        <main className="flex-1 min-w-0 ml-68 min-h-screen overflow-x-hidden">
          <div className="w-full min-w-0 max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12 animate-fade-in">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}