type Props = {
  nome: string;
};

export function Listagem({ nome }: Props) {
  return (
    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
      {nome}
    </span>
  );
}
