"use client";

import { Geist, Geist_Mono } from "next/font/google";
import ErrorScreen from "@/components/errors/ErrorScreen";
import { classifyError } from "@/lib/errors/classify-error";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const kind = classifyError(error);

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-800">
        <main className="min-h-screen flex items-center justify-center p-6">
          <ErrorScreen
            kind={kind}
            onRetry={reset}
            digest={error.digest}
            technicalMessage={error.message}
          />
        </main>
      </body>
    </html>
  );
}
