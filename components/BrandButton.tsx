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
      className="flex flex-col items-center gap-2 min-w-[70px]"
    >
      <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
        <Image
          src={
            brand.logo ||
            `https://placehold.co/60x60/222/fff?text=${encodeURIComponent(
              brand.name.charAt(0)
            )}`
          }
          alt={brand.name}
          width={30}
          height={30}
        />
      </div>
      <span className="text-sm">{brand.name}</span>
    </Link>
  );
}
