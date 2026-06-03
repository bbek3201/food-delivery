/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Categories from "./components/Cat";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/Hero-section";
import { addToCart } from "@/lib/cart";
import FoodDetailSheet from "./components/FoodDetailSheet";

type Dish = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category_id: number;
  category_name?: string;
  ingredients?: string;
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selected, setSelected] = useState<Dish | null>(null);

  // Сагсанд нэмэхийн өмнө баталгаажуулах төлөвүүд
  const [pendingDish, setPendingDish] = useState<Dish | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const url =
      activeCategory === 1
        ? "/api/dishes"
        : `/api/dishes?category_id=${activeCategory}`;

    fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setDishes(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Хоол татахад алдаа гарлаа:", err));
  }, [activeCategory]);

  const handleSelectDish = (dish: Dish) => {
    const preparedDish = { ...dish };
    if (typeof preparedDish.ingredients === "string") {
      preparedDish.ingredients = preparedDish.ingredients
        ? (preparedDish.ingredients.split(",") as any)
        : ([] as any);
    }
    setSelected(preparedDish);
  };

  // + товчлуур дээр дарахад шууд нэмэхгүй, асуух цонхыг нээнэ
  const handleAddToCartClick = (e: React.MouseEvent, dish: Dish) => {
    e.stopPropagation(); // Карт дээр дарагдаж Sheet нээгдэхээс сэргийлнэ
    setPendingDish(dish);
    setIsConfirmOpen(true);
  };

  // "ТИЙМ" гэж дарвал сагсанд нэмнэ
  const handleConfirmAdd = () => {
    if (pendingDish) {
      addToCart({
        id: pendingDish.id,
        name: pendingDish.name,
        price: Number(pendingDish.price),
        image_url: pendingDish.image_url,
      });
    }
    setIsConfirmOpen(false);
    setPendingDish(null);
  };

  // "ҮГҮЙ" гэж дарвал цуцална
  const handleCancelAdd = () => {
    setIsConfirmOpen(false);
    setPendingDish(null);
  };

  return (
    <main className="bg-[#FDF9F3] min-h-screen relative">
      <Header />
      <HeroSection />

      <div className="max-w-7xl mx-auto px-10 pt-10 pb-20 overflow-hidden">
        <Categories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-4xl p-4 shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100"
              onClick={() => handleSelectDish(dish)}
            >
              <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-4">
                <img
                  src={dish.image_url || "/images/placeholder.png"}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <button
                  onClick={(e) => handleAddToCartClick(e, dish)} // <-- Шинэ функц холбов
                  className="absolute bottom-3 right-3 bg-[#634832] w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <span className="text-white text-2xl font-bold">+</span>
                </button>
              </div>

              <div className="px-1">
                <span className="text-[10px] text-[#8B5E34] bg-[#8B5E34]/10 px-2 py-0.5 rounded-full font-bold uppercase mb-1 inline-block">
                  {dish.category_name || "Хоол"}
                </span>
                <h3 className="text-[#2A1C0F] font-bold text-lg mb-1 group-hover:text-[#8B5E34] transition-colors">
                  {dish.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="font-black text-[#8B5E34] text-xl">
                    ₮{Number(dish.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {dishes.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            Энэ ангилалд одоогоор хоол байхгүй байна.
          </div>
        )}
      </div>

      <FoodDetailSheet
        dish={selected as any}
        onClose={() => setSelected(null)}
      />

      {/* --- БАТАЛГААЖУУЛАХ ЦОНХ (CONFIRMATION MODAL) --- */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-999 flex items-center justify-center p-4 animated fadeIn animate-duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            <div className="w-16 h-16 bg-[#8B5E34]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#8B5E34] text-3xl">🛒</span>
            </div>

            <h3 className="text-xl font-black text-[#2A1C0F] mb-2">
              Сагсанд нэмэх үү?
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              <span className="font-bold text-[#8B5E34]">
                &#34;{pendingDish?.name}&#34;
              </span>{" "}
              хоолыг сагсандаа нэмэх үү?
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* ҮГҮЙ ТОПЧЛУУР */}
              <button
                onClick={handleCancelAdd}
                className="py-3 px-6 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-sm"
              >
                ҮГҮЙ
              </button>

              {/* ТИЙМ ТОПЧЛУУР */}
              <button
                onClick={handleConfirmAdd}
                className="py-3 px-6 rounded-xl font-bold text-white bg-[#634832] hover:bg-[#4E3928] active:scale-95 transition-all shadow-md text-sm"
              >
                ТИЙМ
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
