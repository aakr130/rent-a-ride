import Image from "next/image";
import { Review } from "../types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex gap-3">
      <Image
        src={review.image || "/placeholder.svg"}
        alt={review.name}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{review.name}</h4>
          <div className="flex items-center gap-1">
            <span className="text-sm">{review.rating}</span>
            <Image src="/images/star.png" alt="Rating" width={12} height={12} />
          </div>
        </div>
        <p className="text-sm text-gray-600">{review.comment}</p>
      </div>
    </div>
  );
}
