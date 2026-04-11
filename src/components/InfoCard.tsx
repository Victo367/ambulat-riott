import Image from "next/image";
type InfoCardProps = {
title: string;
description: string;
image: string;
};

export default function InfoCard({ title, description, image }: InfoCardProps) {
return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-sm">


    <Image
    src={image}
    alt={title}
    width={400}
    height={160}
    className="w-full h-40 object-cover"
    />

        <div className="p-4">
            <h2 className="font-semibold text-lg text-zinc-900">
            {title}
        </h2>

        <p className="text-sm text-zinc-500 mt-2">
            {description}
        </p>
        </div>
    </div>
    );
}