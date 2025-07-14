"use client";

import { Search } from "lucide-react";
import React, { useState } from "react";
import FilterDialog from "./FilterDialog";

interface SearchboxProps {
  type: "car" | "bike" | "scooter";
  value: string;
  onChange: (value: string) => void;
}

const Searchbox = ({ type, value, onChange }: SearchboxProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search your vehicle..."
          className="w-full px-10 py-3 text-sm bg-white border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Search
          size={18}
          className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
        />
      </div>

      <FilterDialog type={type} />
    </div>
  );
};

export default Searchbox;
