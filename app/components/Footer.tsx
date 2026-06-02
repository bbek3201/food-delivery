/* eslint-disable @next/next/no-img-element */
"use client";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-[#2A1C0F] text-white py-6 px-10 flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-sm uppercase tracking-widest text-gray-400">
            Захиалга авах утас:
          </span>
          <span className="text-2xl font-black italic">7000-1234</span>
        </div>
        <div className="flex gap-6">
          <span className="text-sm">Сошиал хаягууд:</span>
          <div className="flex gap-4">
            <FaFacebook
              size={24}
              className=" hover:text-[#8B5E34] cursor-pointer"
            />
            <FaInstagram
              size={24}
              className=" hover:text-[#8B5E34] cursor-pointer"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <img src="/appstore.png" alt="App Store" className="h-10" />
          <img src="/googleplay.png" alt="Google Play" className="h-10" />
        </div>
      </div>

      <div className="bg-[#FDF9F3] text-[#2A1C0F] px-10 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black italic text-[#8B5E34]">
              МОНГОЛ ХООЛ
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Монголын уламжлалт зоогийг орчин үеийн үйлчилгээтэй хослуулан
              хүргэж байна.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#8B5E34]">
              Цэс
            </h3>
            <ul className="space-y-3 font-semibold">
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Халуун хоол
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Шөл
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Хүйтэн хоол
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Ундаа
                </a>
              </li>
            </ul>
          </div>

          {/* Тусламж */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#8B5E34]">
              Тусламж
            </h3>
            <ul className="space-y-3 font-semibold">
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Хүргэлт, төлбөр
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Түгээмэл асуулт
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Нууцлалын бодлого
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8B5E34]">
                  Үйлчилгээний нөхцөл
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#8B5E34]">
              Холбоо барих
            </h3>
            <p className="text-sm">Утас: 7000-1234</p>
            <p className="text-sm">И-мэйл: info@mongolhool.mn</p>
            <p className="text-sm">Хаяг: УБ хот, Сүхбаатар дүүрэг</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 text-gray-500 text-sm">
          <p>© 2024 Монгол Хоол. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}
