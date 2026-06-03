/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

type Category = { id: number; name: string };

export default function Footer() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  // Өгөгдлийн сангаас хоолны ангиллуудыг кэшгүйгээр унших
  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Footer categories fetch error:", err));
  }, []);

  // Динамик ангиллын хуудас руу шилжих функц
  const handleCategoryNavigation = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    router.push(`/category/${id}`);
  };

  // ТУСЛАМЖИЙН ХУУДАСНУУД РУУ ROUTER.PUSH-ЭЭР ШИЛЖИХ ФУНКЦ
  // Footer.tsx доторх функцийг ингэж шинэчил:
  const handleHelpNavigation = (e: React.MouseEvent, tabName: string) => {
    e.preventDefault();
    router.push(`/help?tab=${tabName}`); // Шууд шинэ тусламжийн хуудас руу таб нэртэйгээр үсэрнэ
  };

  return (
    <footer className="w-full">
      {/* Дээд талын хар хүрэн хэсэг */}
      <div className="bg-[#2A1C0F] text-white py-6 px-10 flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-sm uppercase tracking-widest text-gray-400">
            Захиалга авах утас:
          </span>
          <span className="text-2xl font-black italic">7000-1234</span>
        </div>

        <div className="flex gap-6">
          <span className="text-sm">Сошиал хаягууд:</span>
          <div className="flex gap-4"></div>
        </div>

        <div className="flex gap-4">
          <img
            src="/appstore.png"
            alt="App Store"
            className="h-10 cursor-pointer active:scale-95 transition-transform"
          />
          <img
            src="/googleplay.png"
            alt="Google Play"
            className="h-10 cursor-pointer active:scale-95 transition-transform"
          />
        </div>
      </div>

      {/* Доод талын цайвар хэсэг */}
      <div className="bg-[#FDF9F3] text-[#2A1C0F] px-10 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Компанийн тухай */}
          <div className="space-y-4">
            <h2
              onClick={() => router.push("/")}
              className="text-3xl font-black italic text-[#8B5E34] cursor-pointer"
            >
              МОНГОЛ ХООЛ
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Монголын уламжлалт зоогийг орчин үеийн үйлчилгээтэй хослуулан
              хүргэж байна.
            </p>
          </div>

          {/* Динамик Цэс (Ангиллууд) */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#8B5E34]">
              Цэс
            </h3>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/");
                  }}
                  className="hover:text-[#8B5E34] transition-colors block text-gray-400 text-xs mb-1 uppercase tracking-wider"
                >
                  🏠 Нүүр хуудас
                </a>
              </li>

              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#"
                    onClick={(e) => handleCategoryNavigation(e, cat.id)}
                    className="hover:text-[#8B5E34] transition-colors block py-0.5"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}

              {categories.length === 0 && (
                <span className="text-xs text-gray-400 font-normal">
                  Цэс ачааллаж байна...
                </span>
              )}
            </ul>
          </div>

          {/* ТУСЛАМЖ ХЭСЭГ - Одоо бүгд router.push-тэй холбогдсон */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#8B5E34]">
              Тусламж
            </h3>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleHelpNavigation(e, "delivery")}
                  className="hover:text-[#8B5E34] transition-colors block py-0.5"
                >
                  Хүргэлт, төлбөр
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleHelpNavigation(e, "faq")}
                  className="hover:text-[#8B5E34] transition-colors block py-0.5"
                >
                  Түгээмэл асуулт
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleHelpNavigation(e, "privacy")}
                  className="hover:text-[#8B5E34] transition-colors block py-0.5"
                >
                  Нууцлалын бодлого
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleHelpNavigation(e, "terms")}
                  className="hover:text-[#8B5E34] transition-colors block py-0.5"
                >
                  Үйлчилгээний нөхцөл
                </a>
              </li>
            </ul>
          </div>

          {/* Холбоо барих */}
          <div className="space-y-4 text-sm text-gray-600">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#8B5E34] mb-2">
              Холбоо барих
            </h3>
            <p>
              <span className="font-bold text-[#2A1C0F]">Утас:</span> 7000-1234
            </p>
            <p>
              <span className="font-bold text-[#2A1C0F]">И-мэйл:</span>{" "}
              info@mongolhool.mn
            </p>
            <p>
              <span className="font-bold text-[#2A1C0F]">Хаяг:</span> УБ хот,
              Сүхбаатар дүүрэг
            </p>
          </div>
        </div>

        {/* Зохиогчийн эрх */}
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 text-gray-500 text-sm">
          <p>© 2026 Монгол Хоол. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}
