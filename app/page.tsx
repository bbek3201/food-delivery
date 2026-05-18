export const dynamic = "force-dynamic";


import Appetizers from "./components/Appetizers"
import Footer from "./components/Footer";
import Header from "./components/Header";

import LunchFavorites from "./components/LunchFavorites";
import Salads from "./components/Salads";
 
// app/page.tsx
export default function Home() {
  return (
    <main className="bg-[#333333] min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        <Appetizers />
        <Salads />
        <LunchFavorites />  

      </div>
      <Footer />
    </main>
  );
}