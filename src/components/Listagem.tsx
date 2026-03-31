type Props = {
  nomeSocial: string;
};

export function Listagem({ nomeSocial }: Props) {
  return (
    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
      {nomeSocial}
    </span>
  );
}
