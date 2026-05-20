"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { addToCart } from "@/lib/cart";

type Dish = {
  id: string;
  name: string;
  price: string;
  image_url: string;
  description: string;
};

export default function CategoryPage() {
  const { id } = useParams();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [catName, setCatName] = useState("");

  useEffect(() => {
    fetch(`/api/dishes?category_id=${id}`)
      .then((res) => res.json())
      .then(setDishes);

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const cat = data.find((c: any) => c.id === Number(id));
        if (cat) setCatName(cat.name);
      });
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">{catName}</h1>
      <button
        onClick={() => window.history.back()}
        className="bg-gray-300 text-black py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors mb-8"
      >
        BACK
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-[32px] p-4 shadow-xl">
            <div className="relative h-48 w-full rounded-[24px] overflow-hidden mb-4">
              <img
                src={dish.image_url}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() =>
                  addToCart({
                    id: dish.id,
                    name: dish.name,
                    price: Number(dish.price),
                    image_url: dish.image_url,
                  })
                }
                className="absolute bottom-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <span className="text-red-500 text-xl font-bold">+</span>
              </button>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#E74C3C] font-bold text-lg">
                  {dish.name}
                </h3>
                <span className="font-bold text-black">${dish.price}</span>
              </div>
              <p className="text-gray-500 text-xs">{dish.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
