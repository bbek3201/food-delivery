"use client";

export const dynamic = "force-dynamic";

import Appetizers from "./components/Appetizers";
import Cat from "./components/Cat";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/Hero-section";

import LunchFavorites from "./components/LunchFavorites";
import LunchSalads from "./components/LunchSalads";
import Salads from "./components/Salads";

export default function Home() {
  return (
    <main className="bg-[#333333] min-h-screen">
      <Header />
      <HeroSection />

      <div className="max-w-6xl mx-auto px-4 overflow-hidden">
        <Cat />

        <Appetizers />
        <Salads />
        <LunchFavorites />
        <LunchSalads />
      </div>
      <Footer />
    </main>
  );
}
