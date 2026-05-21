"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Үсрэлт хийхэд хэрэгтэй

type Category = { id: number; name: string };

export default function Cat() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "БҮГД" },
    { id: 2, name: "ХАЛУУН ХООЛ" },
    { id: 3, name: "ШӨЛ" },
    { id: 4, name: "ХҮЙТЭН ХООЛ" },
    { id: 5, name: "УНДАА" },
    { id: 6, name: "ЦАГААН ИДЭЭ" },
  ]);

  const [active, setActive] = useState<number>(1);
  const router = useRouter(); // Router-оо зарлаж өгнө

  const handleCategoryClick = (id: number) => {
    setActive(id);
    // Хэрэв "БҮГД" (ID: 1) бол нүүр хуудас руу, бусад бол тухайн ID-руу үсэрнэ
    if (id === 1) {
      router.push("/");
    } else {
      router.push(`/category/${id}`); // Жишээ нь: /category/2
    }
  };

  return (
    <div className="py-10">
      <h2 className="text-[#2A1C0F] text-3xl font-black mb-8 uppercase tracking-tight">
        ХООЛНЫ ЦЭС
      </h2>

      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)} // Функцээ энд дуудна
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              active === cat.id
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
