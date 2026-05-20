/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";

type Dish = {
  id: string;
  name: string;
  price: string;
  image_url: string;
  description: string;
};

export default function LunchFavorites() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    fetch("/api/dishes?category_id=3")
      .then((res) => res.json())
      .then(setDishes);
  }, []);

  return (
    <section className="py-10">
      <h2 className="text-white text-2xl font-bold mb-8">Lunch Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((food) => (
          <div key={food.id} className="bg-white rounded-4xl p-4 shadow-xl">
            <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-4">
              <img
                src={food.image_url}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <span className="text-red-500 text-xl font-bold">+</span>
              </button>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#E74C3C] font-bold text-lg leading-tight">
                  {food.name}
                </h3>
                <span className="font-bold text-black text-lg">
                  ${food.price}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                {food.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
