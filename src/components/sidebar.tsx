import Link from "next/link";

export default function Sidebar() {
return (
<aside className="w-64 h-screen bg-cyan-600 text-white flex flex-col justify-between p-4 fixed left-0 top-0">
    <div>
        <h1 className="text-xl font-bold mb-8">
        Ambulatório TT
        </h1>

        <nav className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
        Página Inicial
        </Link>

        <Link href="/login" className="flex items-center gap-2 hover:opacity-80">
        Login
        </Link>
        </nav>
    </div>

    <div className="text-sm">
        <p> +55 83 8225-7290</p>
        <p className="mt-2 text-xs opacity-80">
        © Copyright by TT gender
        </p>
    </div>

    </aside>
);
}