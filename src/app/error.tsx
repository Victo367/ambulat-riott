"use client";

import { useEffect } from "react";
import ErrorScreen from "@/components/errors/ErrorScreen";
import { classifyError } from "@/lib/errors/classify-error";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const kind = classifyError(error);

  useEffect(() => {
    console.error("[Ambulatório] Erro na rota:", error);
  }, [error]);

  return (
    <ErrorScreen
      kind={kind}
      onRetry={reset}
      digest={error.digest}
      technicalMessage={error.message}
    />
  );
}
