/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";

type Category = { id: number; name: string };

interface CatProps {
  activeCategory: number;
  onCategoryChange: (id: number) => void;
}

export default function Cat({ activeCategory, onCategoryChange }: CatProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories([{ id: 1, name: "БҮГД" }, ...data]);
        } else {
          setCategories([{ id: 1, name: "БҮГД" }]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([{ id: 1, name: "БҮГД" }]);
      });
  }, []);

  return (
    <div className="py-10">
      <h2 className="text-[#2A1C0F] text-3xl font-black mb-8 uppercase tracking-tight">
        ХООЛНЫ ЦЭС
      </h2>

      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? "bg-[#634832] text-white shadow-md"
                : "bg-transparent text-[#8B5E34] hover:bg-[#8B5E34]/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
