"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setActive(data[0].id);
      });
  }, []);

  const handleTab = (id: number) => {
    setActive(id);
    router.push(`/category/${id}`);
  };

  return (
    <div className="py-6 overflow-hidden">
      <h2 className="text-white text-2xl font-bold mb-6">Categories</h2>
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        <button className="text-white text-lg flex-shrink-0">‹</button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTab(cat.id)}
            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              active === cat.id
                ? "bg-[#E74C3C] text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
        <button className="text-white text-lg flex-shrink-0">›</button>
      </div>
    </div>
  );
}
