import Image from "next/image";
import Link from "next/link";
import { Brand } from "../types";

interface BrandButtonProps {
  brand: Brand;
}

export default function BrandButton({ brand }: BrandButtonProps) {
  return (
    <Link
      href={`/search?brand=${brand.name.toLowerCase()}`}
      className="flex flex-col items-center gap-2 min-w-[70px] group"
    >
      <div className="relative overflow-hidden transition-transform bg-black border-2 border-green-300 rounded-full shadow-md w-14 h-14 group-hover:scale-105">
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          className="object-cover"
        />
      </div>
      <span className="text-[15px] font-medium text-gray-800 transition-colors group-hover:text-blue-500">
        {brand.name}
      </span>
    </Link>
  );
}
