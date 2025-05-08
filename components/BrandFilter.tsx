import Image from "next/image";
import Link from "next/link";
import { Brand } from "../types";

interface BrandFilterProps {
  brand: Brand;
}

export default function BrandFilter({ brand }: BrandFilterProps) {
  const isActive = brand.id === 0; // ALL is active by default

  return (
    <Link
      href={`/search?brand=${brand.name.toLowerCase()}`}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isActive ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Image
        src={brand.logo || "/placeholder.svg"}
        alt={brand.name}
        width={20}
        height={20}
        className={isActive ? "invert" : ""}
      />
      <span className="text-sm">{brand.name}</span>
    </Link>
  );
}
