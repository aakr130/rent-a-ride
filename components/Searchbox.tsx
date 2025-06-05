"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Searchbox = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search your vehicle..."
          className="w-full px-10 py-3 text-sm bg-white border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search
          size={18}
          className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
        />
      </div>

      <Link
        href="/filters"
        className="p-3 transition bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        <SlidersHorizontal size={20} />
      </Link>
    </div>
  );
};

export default Searchbox;
