"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import ConteudoCoverImage from "@/components/ConteudoCoverImage";
import { SLUGS_GUIAS_PADRAO } from "@/lib/conteudo-padrao";

export type GuiaCardProps = {
  title: string;
  description: string;
  image: string;
  slug: string;
};

type LayoutVariant = "terapia-hormonal" | "identidade" | "retificacao" | "sus" | "default";

function getLayout(slug: string): LayoutVariant {
  if ((SLUGS_GUIAS_PADRAO as readonly string[]).includes(slug)) {
    return slug as LayoutVariant;
  }
  return "default";
}

const cardBase =
  "group bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-cyan-200/50 transition-all duration-300 cursor-pointer";

function CardShell({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/guias/${slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/guias/${slug}`);
        }
      }}
      className={`${cardBase} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export default function GuiaCard({ title, description, image, slug }: GuiaCardProps) {
  const layout = getLayout(slug);

  if (layout === "terapia-hormonal") {
    return (
      <CardShell
        slug={slug}
        className="md:col-span-2 p-4 sm:p-6 flex flex-col justify-between"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3 min-w-0">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors flex items-center gap-2">
              {title}
              <ArrowUpRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
          {image ? (
            <div className="w-full md:w-44 h-32 relative rounded-2xl overflow-hidden bg-slate-50 shrink-0">
              <Image src={image} alt={title} fill className="object-cover" unoptimized />
            </div>
          ) : null}
        </div>
      </CardShell>
    );
  }

  if (layout === "identidade") {
    return (
      <CardShell slug={slug} className="p-4 sm:p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl w-fit">
            <BookOpenIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
          <span>Ler artigo completo</span>
          <ArrowUpRightIcon className="w-4 h-4" />
        </div>
      </CardShell>
    );
  }

  if (layout === "retificacao") {
    return (
      <CardShell slug={slug} className="p-4 sm:p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-fit">
            <IdentificationIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        </div>
        {image ? (
          <div className="mt-4 h-24 relative rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        ) : null}
      </CardShell>
    );
  }

  if (layout === "sus") {
    return (
      <CardShell
        slug={slug}
        className="md:col-span-2 p-4 sm:p-6 flex flex-col md:flex-row justify-between gap-6"
      >
        <div className="flex-1 flex flex-col justify-between space-y-4 min-w-0">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-1 rounded-md w-fit inline-block">
              Acesso Público
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-cyan-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
          <span className="text-xs text-cyan-600 font-semibold flex items-center gap-1.5 group-hover:underline">
            Ver pré-requisitos e fluxos de atendimento &rarr;
          </span>
        </div>
        {image ? (
          <div className="w-full md:w-52 min-h-[140px] relative rounded-2xl overflow-hidden shrink-0 bg-slate-50">
            <Image src={image} alt={title} fill className="object-cover" unoptimized />
          </div>
        ) : null}
      </CardShell>
    );
  }

  return (
    <CardShell slug={slug} className="p-4 sm:p-6 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
          <BookOpenIcon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{description}</p>
      </div>

      {image ? (
        <div className="mt-4 h-28 relative rounded-xl overflow-hidden shrink-0">
          <ConteudoCoverImage
            src={image}
            alt={title}
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : null}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
        <span>Ler artigo completo</span>
        <ArrowUpRightIcon className="w-4 h-4" />
      </div>
    </CardShell>
  );
}
