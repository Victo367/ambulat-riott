import Image from "next/image";

type ConteudoCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

/** Imagens de artigos vêm da API ou de upload legado; evita falha do otimizador do Next. */
export default function ConteudoCoverImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
}: ConteudoCoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className={className}
    />
  );
}
