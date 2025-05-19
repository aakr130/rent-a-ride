import { Search } from "lucide-react";
import React, { useState } from "react";

const Searchbox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search your scooter..."
        className="w-full px-10 py-3 text-sm bg-white border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search
        size={18}
        className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
      />
    </div>
  );
};

export default Searchbox;
