import Image from "next/image";

export default function LoginPage() {
return (
    <div className="flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">

        <Image
            src="/login.jpg"
            alt="Logo"
            width={300}
            height={300}
            className="mb-6"
        />

        <form className="flex flex-col gap-4 w-full">

            <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-lg text-zinc-900"
            />

            <input
            type="password"
            placeholder="Senha"
            className="p-3 border rounded-lg text-zinc-900"
            />

            <button className="bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-700 cursor-pointer transition">
            Login
            </button>

        </form>

        </div>
    </div>
);
}