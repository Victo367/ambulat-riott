"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowPathIcon,
  ArrowLeftIcon,
  CircleStackIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  SignalSlashIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import { getErrorContent } from "@/lib/errors/error-content";
import type { ErrorKind } from "@/lib/errors/types";

type IconConfig = {
  Icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  codeBg: string;
};

const ICON_BY_KIND: Record<ErrorKind, IconConfig> = {
  NOT_FOUND: {
    Icon: MagnifyingGlassIcon,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    accentBorder: "border-slate-200",
    codeBg: "bg-slate-100 text-slate-600",
  },
  UNAUTHORIZED: {
    Icon: LockClosedIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-amber-100",
    codeBg: "bg-amber-50 text-amber-700",
  },
  FORBIDDEN: {
    Icon: ShieldExclamationIcon,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-rose-100",
    codeBg: "bg-rose-50 text-rose-700",
  },
  NETWORK: {
    Icon: SignalSlashIcon,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    accentBorder: "border-orange-100",
    codeBg: "bg-orange-50 text-orange-700",
  },
  DATABASE: {
    Icon: CircleStackIcon,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    accentBorder: "border-violet-100",
    codeBg: "bg-violet-50 text-violet-700",
  },
  CHUNK_LOAD: {
    Icon: ArrowPathIcon,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    accentBorder: "border-cyan-100",
    codeBg: "bg-cyan-50 text-cyan-700",
  },
  SERVER: {
    Icon: ServerIcon,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentBorder: "border-rose-100",
    codeBg: "bg-rose-50 text-rose-700",
  },
  COMPONENT: {
    Icon: CodeBracketIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBorder: "border-amber-100",
    codeBg: "bg-amber-50 text-amber-700",
  },
  UNKNOWN: {
    Icon: ExclamationTriangleIcon,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    accentBorder: "border-slate-200",
    codeBg: "bg-slate-100 text-slate-600",
  },
};

export type ErrorScreenProps = {
  kind: ErrorKind;
  onRetry?: () => void;
  digest?: string;
  technicalMessage?: string;
  showTechnical?: boolean;
  compact?: boolean;
};

export default function ErrorScreen({
  kind,
  onRetry,
  digest,
  technicalMessage,
  showTechnical = process.env.NODE_ENV === "development",
  compact = false,
}: ErrorScreenProps) {
  const content = getErrorContent(kind);
  const visual = ICON_BY_KIND[kind];
  const { Icon } = visual;

  const usesRetry =
    kind === "NETWORK" ||
    kind === "DATABASE" ||
    kind === "SERVER" ||
    kind === "UNKNOWN" ||
    kind === "CHUNK_LOAD" ||
    kind === "COMPONENT";

  const primaryIsReload = kind === "CHUNK_LOAD" || kind === "COMPONENT";

  function handlePrimary() {
    if (primaryIsReload) {
      window.location.reload();
      return;
    }
    if (usesRetry && onRetry) {
      onRetry();
      return;
    }
    if (usesRetry) {
      window.location.reload();
    }
  }

  const primaryButton = (
    <button
      type="button"
      onClick={handlePrimary}
      className="flex-1 min-w-[140px] bg-cyan-600 text-white text-sm font-semibold py-3.5 px-5 rounded-xl shadow-md shadow-cyan-600/15 hover:bg-cyan-700 transition-all active:scale-[0.98] cursor-pointer text-center"
    >
      {content.primaryLabel}
    </button>
  );

  const primaryLink =
    content.primaryHref && !usesRetry ? (
      <Link
        href={content.primaryHref}
        className="flex-1 min-w-[140px] bg-cyan-600 text-white text-sm font-semibold py-3.5 px-5 rounded-xl shadow-md shadow-cyan-600/15 hover:bg-cyan-700 transition-all text-center"
      >
        {content.primaryLabel}
      </Link>
    ) : (
      primaryButton
    );

  const resolvedPrimary =
    usesRetry || primaryIsReload ? primaryButton : primaryLink;

  return (
    <div
      className={`flex items-center justify-center w-full ${
        compact ? "py-8" : "min-h-[65vh] py-10"
      }`}
    >
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden animate-fade-in">
        <div className="px-8 pt-8 pb-4 flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${visual.iconBg}`}
          >
            <Icon className={`w-8 h-8 ${visual.iconColor}`} />
          </div>

          <span
            className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${visual.codeBg}`}
          >
            Código {content.code}
          </span>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {content.title}
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="px-8 pb-2 space-y-4">
          <div
            className={`rounded-2xl border p-4 text-left ${visual.accentBorder} bg-slate-50/80`}
          >
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 min-w-0">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Por que isso aconteceu?
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.why}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4 text-left">
            <p className="text-xs font-bold text-cyan-800 uppercase tracking-wider mb-2">
              O que você pode fazer
            </p>
            <ul className="space-y-2">
              {content.suggestions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600 leading-snug"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {showTechnical && (technicalMessage || digest) && (
            <details className="rounded-xl border border-slate-200 bg-slate-50 text-left text-xs">
              <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-500">
                Detalhes técnicos (desenvolvimento)
              </summary>
              <div className="px-4 pb-3 space-y-1 font-mono text-slate-600 break-all">
                {technicalMessage && <p>{technicalMessage}</p>}
                {digest && <p>Digest: {digest}</p>}
              </div>
            </details>
          )}
        </div>

        <div className="px-8 pb-8 pt-4 flex flex-col sm:flex-row gap-3">
          {resolvedPrimary}
          {content.secondaryHref && content.secondaryLabel && (
            <Link
              href={content.secondaryHref}
              className="flex-1 min-w-[140px] border border-slate-200 text-slate-600 text-sm font-semibold py-3.5 px-5 rounded-xl hover:bg-slate-50 transition text-center flex items-center justify-center gap-2"
            >
              {kind !== "NOT_FOUND" && (
                <ArrowLeftIcon className="w-4 h-4 shrink-0" />
              )}
              {content.secondaryLabel}
            </Link>
          )}
        </div>

        {!compact && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-4 flex items-center justify-center gap-2">
            <Image
              src="/logo.png"
              alt=""
              width={20}
              height={20}
              className="rounded opacity-80"
              aria-hidden
            />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Ambulatório TT — Portal de Saúde
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
