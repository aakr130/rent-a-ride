"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Car } from "../../types";
import { useUser } from "@/app/hooks/useUser";

export interface WishlistContextType {
  items: Car[];
  toggleItem: (vehicle: Car) => void;
  isWishlisted: (vehicleId: number) => boolean;
  clearWishlist: () => void;
  removeFromWishlist: (id: number) => void;
  addToWishlist: (item: Car) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Car[]>([]);
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    if (isLoading || !user) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load wishlist");
        const data: Car[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error("❌ Failed to load wishlist:", err);
      }
    };

    fetchWishlist();
  }, [user, isLoading]);

  const syncToBackend = async (car: Car) => {
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle_id: car.id }),
      });
    } catch (err) {
      console.error(`❌ Failed syncing ${car.id}`, err);
    }
  };

  const addToWishlist = (item: Car) => {
    setItems((prev) => {
      const map = new Map(prev.map((v) => [v.id, v]));
      map.set(item.id, item);
      const updated = [...map.values()];
      syncToBackend(item);
      return updated;
    });
  };

  const removeFromWishlist = (id: number) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      return updated;
    });
  };

  const toggleItem = (vehicle: Car) => {
    const isAlreadyWishlisted = items.some((item) => item.id === vehicle.id);
    if (isAlreadyWishlisted) {
      removeFromWishlist(vehicle.id);
    } else {
      addToWishlist(vehicle);
    }
  };

  const isWishlisted = (vehicleId: number) => {
    return items.some((item) => item.id === vehicleId);
  };

  const clearWishlist = () => {
    // Optional: batch delete from backend here
    items.forEach((item) => removeFromWishlist(item.id));
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleItem,
        isWishlisted,
        clearWishlist,
        removeFromWishlist,
        addToWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
