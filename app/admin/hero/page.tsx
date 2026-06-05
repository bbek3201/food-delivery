/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HeroSlide = {
  id: number;
  image_url: string;
  title: string;
  subtitle: string;
  order_index: number;
};

export default function HeroSlidePage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [slideForm, setSlideForm] = useState({
    title: "",
    subtitle: "",
    order_index: "0",
  });
  const [slideImageFile, setSlideImageFile] = useState<File | null>(null);
  const [slideImagePreview, setSlideImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!slideImageFile && !slideImagePreview) return alert("Зураг сонгоно уу");
    setSaving(true);
    let finalImageUrl = slideImagePreview;
    if (slideImageFile) {
      const data = new FormData();
      data.append("file", slideImageFile);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      finalImageUrl = json.url;
    }
    await fetch("/api/hero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...slideForm,
        image_url: finalImageUrl,
        order_index: parseInt(slideForm.order_index),
      }),
    });
    setSaving(false);
    setShowModal(false);
    setSlideImageFile(null);
    setSlideImagePreview("");
    setSlideForm({ title: "", subtitle: "", order_index: "0" });
    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Слайд устгах уу?")) return;
    setDeletingId(id);
    await fetch("/api/hero", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  };

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ backgroundColor: "#f5f0eb" }}
    >
      {/* Sidebar */}
      <aside
        className="w-52 flex flex-col py-8 px-5 shrink-0"
        style={{ backgroundColor: "#2c1a0e" }}
      >
        <button onClick={() => router.push("/")} className="mb-10">
          <img
            src="/mainlogo.png"
            alt="logo"
            className="w-16 h-16 object-contain mx-auto"
          />
          <p
            className="text-center text-xs mt-2 font-bold tracking-widest"
            style={{ color: "#c9a97a" }}
          >
            АДМИН
          </p>
        </button>
        <nav className="space-y-2">
          <button
            onClick={() => router.push("/admin")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors hover:bg-white/10"
            style={{ color: "#c9a97a" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Хоолны цэс
          </button>
          <button
            onClick={() => router.push("/admin/hero")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#c9a97a", color: "#2c1a0e" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Hero слайд
          </button>
          <button
            onClick={() => router.push("/admin/tables")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors hover:bg-white/10"
            style={{ color: "#c9a97a" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 6h18M3 14h18M3 18h18"
              />
            </svg>
            Ширээ / QR
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors hover:bg-white/10"
            style={{ color: "#c9a97a" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Захиалгууд
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: "#2c1a0e" }}
            >
              Hero слайд
            </h1>
            <p className="text-sm" style={{ color: "#8a6a4a" }}>
              Нүүр хуудасны слайд зургуудыг удирдах
            </p>
          </div>
          <button
            onClick={() => {
              setSlideForm({
                title: "",
                subtitle: "",
                order_index: String(slides.length),
              });
              setSlideImageFile(null);
              setSlideImagePreview("");
              setShowModal(true);
            }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
          >
            + Слайд нэмэх
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
              style={{ borderColor: "#c9a97a", borderTopColor: "transparent" }}
            />
          </div>
        ) : slides.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20"
            style={{ color: "#8a6a4a" }}
          >
            <svg
              className="w-16 h-16 mb-4 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>Слайд байхгүй байна</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="rounded-2xl overflow-hidden group"
                style={{
                  backgroundColor: "#fff8f2",
                  border: "1px solid #e8ddd4",
                }}
              >
                <div className="relative h-40">
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(slide.id)}
                      disabled={deletingId === slide.id}
                      className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs"
                    style={{ backgroundColor: "#c9a97a", color: "#2c1a0e" }}
                  >
                    #{slide.order_index + 1}
                  </div>
                </div>
                <div className="p-3">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#2c1a0e" }}
                  >
                    {slide.title || "—"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8a6a4a" }}>
                    {slide.subtitle || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(44,26,14,0.5)" }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-md shadow-2xl"
            style={{ backgroundColor: "#fff8f2" }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "#2c1a0e" }}>
              Шинэ слайд нэмэх
            </h2>
            <div className="space-y-3">
              <input
                placeholder="Гарчиг (заавал биш)"
                value={slideForm.title}
                onChange={(e) =>
                  setSlideForm({ ...slideForm, title: e.target.value })
                }
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  border: "1px solid #e8ddd4",
                  backgroundColor: "#fff",
                  color: "#2c1a0e",
                }}
              />
              <input
                placeholder="Дэд гарчиг (заавал биш)"
                value={slideForm.subtitle}
                onChange={(e) =>
                  setSlideForm({ ...slideForm, subtitle: e.target.value })
                }
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  border: "1px solid #e8ddd4",
                  backgroundColor: "#fff",
                  color: "#2c1a0e",
                }}
              />
              <input
                placeholder="Дараалал (0, 1, 2...)"
                type="number"
                value={slideForm.order_index}
                onChange={(e) =>
                  setSlideForm({ ...slideForm, order_index: e.target.value })
                }
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  border: "1px solid #e8ddd4",
                  backgroundColor: "#fff",
                  color: "#2c1a0e",
                }}
              />
              <div className="space-y-2">
                <label className="block cursor-pointer">
                  <div
                    className="w-full rounded-xl px-4 py-2.5 text-sm flex items-center gap-2"
                    style={{
                      border: "1px dashed #c9a97a",
                      backgroundColor: "#fff",
                      color: "#8a6a4a",
                    }}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {slideImageFile ? slideImageFile.name : "Зураг сонгох..."}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSlideImageFile(file);
                      setSlideImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {slideImagePreview && (
                  <img
                    src={slideImagePreview}
                    alt="preview"
                    className="w-full h-36 object-cover rounded-xl"
                  />
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{
                  border: "1px solid #e8ddd4",
                  color: "#8a6a4a",
                  backgroundColor: "#fff",
                }}
              >
                Болих
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
              >
                {saving ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
