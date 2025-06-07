"use client";

import { Search } from "lucide-react";
import React, { useState } from "react";
import FilterDialog from "./FilterDialog"; // adjust path if needed

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

      {/* 🔁 Replaced the Link with your dialog */}
      <FilterDialog />
    </div>
  );
};

export default Searchbox;
