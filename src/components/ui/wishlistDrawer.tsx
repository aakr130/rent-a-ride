"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Trash2 } from "lucide-react";
import VehicleCard from "../../../components/VehicleCard";

export default function WishlistDrawer() {
  const { items: wishlist, toggleItem, clearWishlist } = useWishlist();

  const uniqueWishlist = [
    ...new Map(wishlist.map((item) => [item.id, item])).values(),
  ];

  return (
    <Sheet>
      <SheetTrigger className="relative inline-flex items-center py-2 text-black transition duration-300 hover:text-red-400 group md:py-0">
        <Heart className="text-red-500 cursor-pointer w-7 h-7" />
        <span className="sr-only">Wishlist</span>
        {uniqueWishlist.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full cursor-pointer">
            {uniqueWishlist.length}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>My Wishlist</span>
            {uniqueWishlist.length > 0 && (
              <button
                className="flex items-center mt-10 text-xs font-medium text-red-600 cursor-pointer hover:underline"
                onClick={() => {
                  clearWishlist();
                }}
              >
                <Trash2 className="w-4 h-4 mr-1 " />
                Clear All
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {uniqueWishlist.length === 0 ? (
            <p className="text-sm text-gray-500">No vehicles wishlisted yet.</p>
          ) : (
            [...new Map(wishlist.map((item) => [item.id, item])).values()].map(
              (item) => <VehicleCard key={item.id} vehicle={item} />
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
