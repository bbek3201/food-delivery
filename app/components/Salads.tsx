/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import FoodDetailSheet from "./FoodDetailSheet";

type Dish = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
};

export default function Salads() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selected, setSelected] = useState<Dish | null>(null);

  useEffect(() => {
    fetch("/api/dishes?category_id=4")
      .then((r) => r.json())
      .then(setDishes);
  }, []);

  if (dishes.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-[#2A1C0F] text-3xl font-black mb-10 uppercase tracking-tight">
        Салат ба Зууш
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {dishes.map((food) => (
          <div
            key={food.id}
            onClick={() => setSelected(food)}
            className="bg-white rounded-4xl p-4 shadow-sm hover:shadow-xl transition-all group border border-gray-50 flex flex-col cursor-pointer"
          >
            <div className="relative h-44 w-full rounded-3xl overflow-hidden mb-4">
              <img
                src={food.image_url || "/images/placeholder.png"}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(food);
                }}
                className="absolute bottom-3 right-3 bg-[#634832] w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#4E3928] active:scale-95 transition-all"
              >
                <span className="text-white text-2xl font-bold">+</span>
              </button>
            </div>
            <div className="px-1 flex flex-col grow">
              <h3 className="text-[#2A1C0F] font-extrabold text-lg leading-tight mb-2 group-hover:text-[#8B5E34] transition-colors">
                {food.name}
              </h3>
              <div className="mt-auto flex justify-between items-center">
                <span className="font-black text-[#8B5E34] text-xl">
                  ₮{Number(food.price).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400 text-[10px] mt-2 line-clamp-2 leading-relaxed">
                {food.description ||
                  "Шинэхэн ногоогоор бэлтгэсэн амттай салат."}
              </p>
            </div>
          </div>
        ))}
      </div>
      <FoodDetailSheet dish={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
