/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react"; // useEffect нэмсэн
import { addToCart } from "@/lib/cart";

type Dish = {
  id: string;
  name: string;
  price: string;
  image_url: string;
  description: string;
};

type Props = {
  dish: Dish | null;
  onClose: () => void;
};

export default function FoodDetailSheet({ dish, onClose }: Props) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (dish) {
      setQty(1);
    }
  }, [dish?.id]);

  if (!dish) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: dish.id,
        name: dish.name,
        price: Number(dish.price),
        image_url: dish.image_url,
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden flex shadow-2xl"
        style={{ width: 640, maxWidth: "95vw", height: 340 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-shrink-0" style={{ width: 260 }}>
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col px-7 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors text-base font-bold leading-none"
          >
            ×
          </button>

          <h2 className="text-xl font-bold text-[#E74C3C] pr-8 leading-snug">
            {dish.name}
          </h2>

          <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-3">
            {dish.description}
          </p>

          <div className="flex-1" />

          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Total price</p>
              <p className="text-2xl font-extrabold text-gray-900">
                ${(Number(dish.price) * qty).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-[#E74C3C] hover:opacity-70 transition-opacity"
                style={{ fontSize: 20 }}
              >
                ‹
              </button>
              <span className="font-bold text-base w-5 text-center text-gray-900">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center text-[#E74C3C] hover:opacity-70 transition-opacity"
                style={{ fontSize: 20 }}
              >
                ›
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-gray-900 hover:bg-gray-700 active:scale-[0.98] text-white py-3 rounded-2xl font-bold text-sm tracking-wide transition-all"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
