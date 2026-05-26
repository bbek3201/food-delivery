/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Header() {
  return (
    <header className="w-full h-20 bg-[#FDF9F3] flex items-center justify-between px-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#8B5E34] rounded-full flex items-center justify-center">
          <img src="/header.png" alt="Logo" className="w-8 h-8 invert" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[#634832] font-black text-xl tracking-tight uppercase">
            Монгол Хоол
          </span>
          <span className="text-[#8B5E34] text-xs font-medium">
            үндэсний хоол
          </span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {["НҮҮР", "ХООЛНЫ ЦЭС", "БИДНИЙ ТУХАЙ", "БИДДЭЭ", "ХОЛБОО БАРИХ"].map(
          (item) => (
            <a
              key={item}
              href="#"
              className="text-[#634832] font-bold text-xs hover:text-[#8B5E34] transition-colors"
            >
              {item}
            </a>
          ),
        )}
      </nav>

      <div className="flex items-center gap-6">
        <button className="text-[#634832] hover:scale-110 transition-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#634832]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="absolute -top-1 -right-2 bg-[#8B5E34] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#FDF9F3]">
            1
          </span>
        </div>

        <button
          onClick={() => (window.location.href = "/sign-up")}
          className="bg-[#634832] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#4E3928] transition-all shadow-md"
        >
          НЭВТРЭХ
        </button>
      </div>
    </header>
  );
}
