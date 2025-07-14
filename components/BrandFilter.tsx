"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";

interface BrandProps {
  brand: {
    id: number;
    name: string;
    logo: string;
  };
  type?: "car" | "bike" | "scooter";
}

export default function BrandFilter({ brand, type = "car" }: BrandProps) {
  const searchParams = useSearchParams();
  const selected = searchParams?.get("brand");
  const isSelected = selected?.toLowerCase() === brand.name.toLowerCase();

  const isAll = brand.name.toLowerCase() === "all";

  const href = isAll
    ? `/dashboard/${type}s`
    : `/search?type=${type}&brand=${brand.name.toLowerCase()}`;

  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-col items-center gap-2 min-w-[70px] group",
        isSelected && "bg-blue-100 rounded-md py-1"
      )}
    >
      <div className="relative overflow-hidden transition-transform border-2 border-green-300 rounded-full shadow-md w-14 h-14 group-hover:scale-105">
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
