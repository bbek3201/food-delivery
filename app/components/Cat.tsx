"use client";
import { useState } from "react";

const categories = [
  "Appetizers",
  "Salads",
  "Pizzas",
  "Lunch favorites",
  "Main dishes",
  "Fish & Sea foods",
  "Side dish",
  "Brunch",
  "Desserts",
];

export default function Categories() {
  const [active, setActive] = useState("Appetizers");

  return (
    <div className="py-6 overflow-hidden">
      <h2 className="text-white text-2xl font-bold mb-6">Categories</h2>
      <div className="flex items-center gap-3 overflow-x-hidden scrollbar-hide">
        <button className="text-white text-lg flex-shrink-0">‹</button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              active === cat
                ? "bg-[#E74C3C] text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
        <button className="text-white text-lg flex-shrink-0">›</button>
      </div>
    </div>
  );
}
