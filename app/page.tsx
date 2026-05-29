/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

export const dynamic = "force-dynamic";

import Categories from "./components/Cat";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/Hero-section";

import HotFoods from "./components/HotFoods";
import SpecialSoup from "./components/SpecialSoup";
import DessertandSalad from "./components/DessertandSalad";

export default function Home() {
  return (
    <main className="bg-[#FDF9F3] min-h-screen">
      <Header />
      <HeroSection />

      <div className="max-w-7xl mx-auto px-10 pt-20 pb-20 overflow-hidden">
        <Categories />

        <div className="flex flex-col gap-16">
          <DessertandSalad />

          <SpecialSoup />
          <HotFoods />
        </div>

        <div className="flex justify-center mt-16"></div>
      </div>

      <Footer />
    </main>
  );
}
