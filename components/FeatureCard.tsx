import Image from "next/image";
import { Feature } from "../types";

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="bg-gray-100 p-3 rounded-lg">
      <div className="flex items-center justify-center mb-2">
        <Image
          src={`/images/features/${feature.icon}.png`}
          alt={feature.title}
          width={24}
          height={24}
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500">{feature.title}</p>
        <p className="text-sm font-medium">{feature.value}</p>
      </div>
    </div>
  );
}
