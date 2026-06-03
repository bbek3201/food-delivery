/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { addToCart } from "@/lib/cart";

type Dish = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  ingredients?: string[];
};

type Props = {
  dish: Dish | null;
  onClose: () => void;
};

export default function FoodDetailSheet({ dish, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "info" | "ingredient" | "delivery"
  >("info");

  useEffect(() => {
    if (dish) setQty(1);
  }, [dish?.id]);

  if (!dish) return null;

  const handleAdd = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (!user) {
        window.location.href = "/sign-in";
        return;
      }
    }
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
        backgroundColor: "rgba(44,26,14,0.6)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl overflow-hidden flex shadow-2xl"
        style={{ width: 680, maxWidth: "95vw", backgroundColor: "#fff8f2" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left image */}
        <div className="relative shrink-0" style={{ width: 280 }}>
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col px-7 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-base font-bold"
            style={{ backgroundColor: "#e8ddd4", color: "#8a6a4a" }}
          >
            ×
          </button>

          <h2
            className="text-xl font-bold pr-8 leading-snug"
            style={{ color: "#2c1a0e" }}
          >
            {dish.name}
          </h2>
          <p
            className="text-2xl font-extrabold mt-1"
            style={{ color: "#c9a97a" }}
          >
            ₮{(Number(dish.price) * qty).toLocaleString()}
          </p>

          <p
            className="text-sm mt-2 leading-relaxed line-clamp-2"
            style={{ color: "#8a6a4a" }}
          >
            {dish.description}
          </p>

          {/* Qty + Add button */}
          <div className="flex items-center gap-3 mt-4">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ backgroundColor: "#e8ddd4" }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center font-bold text-lg"
                style={{ color: "#2c1a0e" }}
              >
                −
              </button>
              <span
                className="font-bold text-sm w-5 text-center"
                style={{ color: "#2c1a0e" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-6 h-6 flex items-center justify-center font-bold text-lg"
                style={{ color: "#2c1a0e" }}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all"
              style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
            >
              Сагсанд нэмэх
            </button>
          </div>

          {/* Features */}
          <div className="flex gap-4 mt-4">
            <div
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#8a6a4a" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Эрүүл орц
            </div>
            <div
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#8a6a4a" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Шуурхай хүргэлт
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-0 mt-5"
            style={{ borderBottom: "2px solid #e8ddd4" }}
          >
            {[
              { key: "info", label: "Тайлбар" },
              { key: "ingredient", label: "Найрлага" },
              { key: "delivery", label: "Хүргэлт" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as typeof activeTab)}
                className="px-4 py-2 text-xs font-bold transition-colors"
                style={{
                  color: activeTab === t.key ? "#2c1a0e" : "#8a6a4a",
                  borderBottom:
                    activeTab === t.key
                      ? "2px solid #2c1a0e"
                      : "2px solid transparent",
                  marginBottom: -2,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            className="mt-3 text-xs leading-relaxed"
            style={{ color: "#8a6a4a" }}
          >
            {activeTab === "info" && (
              <p>{dish.description || "Мэдээлэл байхгүй."}</p>
            )}
            {/* Хэрэв идэвхтэй таб нь "Найрлага" байвал */}
            {activeTab === "ingredient" && (
              <p className="text-sm" style={{ color: "#8a6a4a" }}>
                {/* Сонгогдсон хоолонд найрлага байвал харуулна, байхгүй бол анхааруулна */}
                {dish.ingredients || "Найрлагын мэдээлэл оруулаагүй байна."}
              </p>
            )}
            {activeTab === "delivery" && (
              <p>Захиалгаас хойш 30–60 минутын дотор хүргэнэ.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
