"use client";

export const dynamic = "force-dynamic";

import Categories from "./components/Cat"; // Нэрийг нь ойлгомжтой болгов
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/Hero-section";

// Хоолны жагсаалтууд (Картууд)
import Appetizers from "./components/Appetizers";
import Salads from "./components/Salads";
import LunchFavorites from "./components/LunchFavorites";
import LunchSalads from "./components/LunchSalads";

export default function Home() {
  return (
    // Хар өнгийг (#333333) скриншот дээрх цайвар шаргал (#FDF9F3) болгов
    <main className="bg-[#FDF9F3] min-h-screen">
      <Header />
      <HeroSection />

      {/* Hero-ийн цагаан блоктой наалдуулахгүйн тулд mt-20 зай авна */}
      <div className="max-w-7xl mx-auto px-10 pt-20 pb-20 overflow-hidden">
        <Categories />

        {/* Хоолны жагсаалт хэсэг */}
        <div className="flex flex-col gap-16">
          <Appetizers />

          <LunchFavorites />
          <LunchSalads />
        </div>

        {/* "БҮГДИЙГ ҮЗЭХ" товчлуур (Скриншот дээрх шиг) */}
        <div className="flex justify-center mt-16">
          <button className="bg-[#634832] text-white px-12 py-3 rounded-xl font-bold text-sm hover:bg-[#4E3928] transition-all shadow-lg">
            БҮГДИЙГ ҮЗЭХ
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
