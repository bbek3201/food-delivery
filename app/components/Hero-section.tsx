"use client";
import { useEffect, useState } from "react";

type Slide = {
  id: number;
  image_url: string;
  title: string;
  subtitle: string;
  order_index: number;
};

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides]);

  const slide = slides[current];

  return (
    <div className="relative w-full">
      <div className="relative w-full h-150 bg-[#2A1C0F] overflow-visible">
        {slide ? (
          <img
            key={slide.id}
            src={slide.image_url}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-700"
          />
        ) : (
          <img
            src="buuz.png"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center justify-between px-10">
          <div className="w-1/2">
            <h1 className="text-white font-black text-6xl uppercase leading-tight">
              {slide?.title || (
                <>
                  Монгол
                  <br />
                  үндэсний хоол
                </>
              )}
            </h1>
            <p className="text-gray-300 mt-4 text-lg max-w-md">
              {slide?.subtitle ||
                "Эрүүл, амттай, уламжлалт монгол хоолыг хүртээмжтэй үнээр."}
            </p>
          </div>
        </div>

        {/* Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor:
                    i === current ? "#c9a97a" : "rgba(255,255,255,0.4)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        )}

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-30 w-full max-w-6xl px-4">
          <div className="bg-[#FDF9F3] rounded-3xl shadow-xl p-8 grid grid-cols-3 gap-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[#634832] font-extrabold text-sm uppercase">
                  Үндэсний уламжлал
                </span>
                <span className="text-[#8B5E34] text-[10px]">
                  Эртний уламжлалт жор, арга барил
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 border-x border-gray-200 px-6">
              <div className="flex flex-col">
                <span className="text-[#634832] font-extrabold text-sm uppercase">
                  Эрүүл орц, найрлага
                </span>
                <span className="text-[#8B5E34] text-[10px]">
                  Байгалийн цэвэр, эрүүл бүтээгдэхүүн
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
      <div className="h-32 w-full bg-transparent"></div>
    </div>
  );
}
