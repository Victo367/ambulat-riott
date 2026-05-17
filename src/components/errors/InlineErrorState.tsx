"use client";

import { classifyError } from "@/lib/errors/classify-error";
import { getErrorContent } from "@/lib/errors/error-content";
import type { ErrorKind } from "@/lib/errors/types";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

type InlineErrorStateProps = {
  message: string;
  onRetry?: () => void;
  kind?: ErrorKind;
  className?: string;
};

export default function InlineErrorState({
  message,
  onRetry,
  kind: kindProp,
  className = "",
}: InlineErrorStateProps) {
  const kind = kindProp ?? classifyError(new Error(message));
  const content = getErrorContent(kind);

  return (
    <div
      className={`max-w-xl mx-auto text-center py-16 px-4 space-y-5 animate-fade-in ${className}`}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-600">
        <ExclamationCircleIcon className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {content.code}
        </span>
        <h2 className="text-lg font-extrabold text-slate-900">
          {content.title}
        </h2>
        <p className="text-sm text-rose-600 font-medium">{message}</p>
        <p className="text-sm text-slate-500 leading-relaxed">{content.why}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-cyan-600 font-semibold text-sm hover:underline cursor-pointer"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
