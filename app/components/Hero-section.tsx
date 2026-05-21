/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function HeroSection() {
  return (
    <div className="relative w-full">
      {/* 1. Үндсэн Hero хэсэг */}
      <div className="relative w-full h-[600px] bg-[#2A1C0F] overflow-visible">
        {/* Арын дэвсгэр зураг */}
        <img
          src="buuz.png"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center justify-between px-10">
          {/* Зүүн тал: Текст */}
          <div className="w-1/2">
            <h1 className="text-white font-black text-6xl uppercase leading-tight">
              Монгол
              <br />
              үндэсний хоол
            </h1>
            <p className="text-gray-300 mt-4 text-lg max-w-md">
              Эрүүл, амттай, уламжлалт монгол хоолыг хүртээмжтэй үнээр.
            </p>
            <button className="mt-8 bg-[#634832] text-white px-8 py-3 rounded-lg font-bold uppercase hover:bg-[#4E3928] transition-all">
              ЦЭС ҮЗЭХ
            </button>
          </div>
        </div>

        {/* 2. Доод талын Цагаан блок (Features) */}
        {/* -bottom-16 ашиглан Hero-оос илүү гаргаж байрлуулна */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-30 w-full max-w-6xl px-4">
          <div className="bg-[#FDF9F3] rounded-3xl shadow-xl p-8 grid grid-cols-3 gap-6 border border-gray-100">
            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#8B5E34]/20 rounded-full flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#634832] font-extrabold text-sm uppercase">
                  Үндэсний уламжлал
                </span>
                <span className="text-[#8B5E34] text-[10px]">
                  Эртийн уламжлалт жор, арга барил
                </span>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex items-center gap-4 border-x border-gray-200 px-6">
              <div className="w-12 h-12 bg-[#8B5E34]/20 rounded-full flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#634832] font-extrabold text-sm uppercase">
                  Эрүүл орц, найрлага
                </span>
                <span className="text-[#8B5E34] text-[10px]">
                  Байгалийн цэвэр, эрүүл бүтээгдэхүүн
                </span>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#8B5E34]/20 rounded-full flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#634832] font-extrabold text-sm uppercase">
                  Шуурхай хүргэлт
                </span>
                <span className="text-[#8B5E34] text-[10px]">
                  Таны хаалган дээр шуурхай хүргэнэ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Доод талын хоосон зай (Spacer) */}
      {/* Энэ зай байхгүй бол блок чинь Категори хэсгийг дарчихна */}
      <div className="h-32 w-full bg-transparent"></div>
    </div>
  );
}
