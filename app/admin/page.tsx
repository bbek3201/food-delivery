/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };
type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  category_name: string;
};
type HeroSlide = {
  id: number;
  image_url: string;
  title: string;
  subtitle: string;
  order_index: number;
};

export default function FoodMenuPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"menu" | "hero">("menu");
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Hero slides state
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [slideForm, setSlideForm] = useState({
    title: "",
    subtitle: "",
    order_index: "0",
  });
  const [slideImageFile, setSlideImageFile] = useState<File | null>(null);
  const [slideImagePreview, setSlideImagePreview] = useState("");
  const [savingSlide, setSavingSlide] = useState(false);
  const [deletingSlideId, setDeletingSlideId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeCat
      ? `/api/dishes?category_id=${activeCat}`
      : "/api/dishes";
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setDishes(Array.isArray(data) ? data : []))
      .catch(() => setDishes([]))
      .finally(() => setLoading(false));
  }, [activeCat]);

  useEffect(() => {
    if (activeTab !== "hero") return;
    setSlidesLoading(true);
    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []))
      .finally(() => setSlidesLoading(false));
  }, [activeTab]);

  const grouped = categories.map((cat) => ({
    ...cat,
    dishes: dishes.filter((d) => d.category_id === cat.id),
  }));

  const openAdd = (category_id: number) => {
    setEditDish(null);
    setImageFile(null);
    setForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: String(category_id),
    });
    setShowModal(true);
  };

  const openEdit = (dish: Dish) => {
    setEditDish(dish);
    setImageFile(null);
    setForm({
      name: dish.name,
      description: dish.description || "",
      price: String(dish.price),
      image_url: dish.image_url || "",
      category_id: String(dish.category_id),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    let finalImageUrl = form.image_url;
    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      finalImageUrl = json.url;
    }
    const body = {
      ...form,
      image_url: finalImageUrl,
      price: parseFloat(form.price),
    };
    if (editDish) {
      await fetch(`/api/dishes/${editDish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          category_id: parseInt(form.category_id),
        }),
      });
    }
    setSaving(false);
    setShowModal(false);
    setImageFile(null);
    const url = activeCat
      ? `/api/dishes?category_id=${activeCat}`
      : "/api/dishes";
    fetch(url)
      .then((r) => r.json())
      .then(setDishes);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Устгах уу?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
      if (res.ok) setDishes((prev) => prev.filter((d) => d.id !== id));
      else {
        const e = await res.json();
        alert(`Алдаа: ${e.error}`);
      }
    } catch {
      alert("Сүлжээний алдаа гарлаа.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveSlide = async () => {
    if (!slideImageFile && !slideImagePreview) return alert("Зураг сонгоно уу");
    setSavingSlide(true);
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
    setSavingSlide(false);
    setShowSlideModal(false);
    setSlideImageFile(null);
    setSlideImagePreview("");
    setSlideForm({ title: "", subtitle: "", order_index: "0" });
    fetch("/api/hero")
      .then((r) => r.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []));
  };

  const handleDeleteSlide = async (id: number) => {
    if (!confirm("Слайд устгах уу?")) return;
    setDeletingSlideId(id);
    await fetch("/api/hero", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeletingSlideId(null);
  };

  const totalCount = dishes.length;

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ backgroundColor: "#f5f0eb" }}
    >
      {/* Sidebar */}
      <aside
        className="w-52 flex flex-col py-8 px-5 shrink-0"
        style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
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
            onClick={() => setActiveTab("menu")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={
              activeTab === "menu"
                ? { backgroundColor: "#c9a97a", color: "#2c1a0e" }
                : { color: "#c9a97a" }
            }
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
            onClick={() => setActiveTab("hero")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors"
            style={
              activeTab === "hero"
                ? { backgroundColor: "#c9a97a", color: "#2c1a0e" }
                : { color: "#c9a97a" }
            }
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
        {/* ===== HERO TAB ===== */}
        {activeTab === "hero" && (
          <>
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
                  setShowSlideModal(true);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
              >
                + Слайд нэмэх
              </button>
            </div>

            {slidesLoading ? (
              <div className="flex items-center justify-center py-20">
                <div
                  className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
                  style={{
                    borderColor: "#c9a97a",
                    borderTopColor: "transparent",
                  }}
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
                          onClick={() => handleDeleteSlide(slide.id)}
                          disabled={deletingSlideId === slide.id}
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
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#8a6a4a" }}
                      >
                        {slide.subtitle || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== MENU TAB ===== */}
        {activeTab === "menu" && (
          <>
            <div className="mb-8">
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "#2c1a0e" }}
              >
                Хоолны ангилал
              </h1>
              <p className="text-sm" style={{ color: "#8a6a4a" }}>
                Хоол нэмэх, засах, устгах
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCat(null)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={
                  activeCat === null
                    ? { backgroundColor: "#2c1a0e", color: "#f5f0eb" }
                    : { backgroundColor: "#e8ddd4", color: "#2c1a0e" }
                }
              >
                Бүгд <span className="text-xs opacity-70">{totalCount}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={
                    activeCat === cat.id
                      ? { backgroundColor: "#2c1a0e", color: "#f5f0eb" }
                      : { backgroundColor: "#e8ddd4", color: "#2c1a0e" }
                  }
                >
                  {cat.name}
                  <span className="text-xs opacity-70">
                    {dishes.filter((d) => d.category_id === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div
                  className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
                  style={{
                    borderColor: "#c9a97a",
                    borderTopColor: "transparent",
                  }}
                />
              </div>
            ) : (
              <div className="space-y-10">
                {(activeCat
                  ? grouped.filter((g) => g.id === activeCat)
                  : grouped
                ).map((cat) => (
                  <section key={cat.id}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3
                        className="text-base font-bold"
                        style={{ color: "#2c1a0e" }}
                      >
                        {cat.name}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#e8ddd4", color: "#8a6a4a" }}
                      >
                        {cat.dishes.length} хоол
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      <button
                        onClick={() => openAdd(cat.id)}
                        className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 py-10 transition-colors"
                        style={{
                          borderColor: "#c9a97a",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#e8ddd4")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#c9a97a" }}
                        >
                          <span className="text-white text-xl font-light">
                            +
                          </span>
                        </div>
                        <span
                          className="text-xs text-center px-2"
                          style={{ color: "#8a6a4a" }}
                        >
                          {cat.name}-д нэмэх
                        </span>
                      </button>
                      {cat.dishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="rounded-2xl overflow-hidden group transition-shadow hover:shadow-lg"
                          style={{
                            backgroundColor: "#fff8f2",
                            border: "1px solid #e8ddd4",
                          }}
                        >
                          <div className="relative">
                            <img
                              src={dish.image_url || "/images/placeholder.png"}
                              alt={dish.name}
                              className="w-full h-36 object-cover"
                            />
                            <button
                              onClick={() => openEdit(dish)}
                              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                style={{ color: "#2c1a0e" }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(dish.id)}
                              disabled={deletingId === dish.id}
                              className="absolute top-2 left-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="w-3.5 h-3.5 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="p-3">
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <p
                                className="text-sm font-semibold leading-tight"
                                style={{ color: "#2c1a0e" }}
                              >
                                {dish.name}
                              </p>
                              <span
                                className="text-sm font-bold shrink-0"
                                style={{ color: "#c9a97a" }}
                              >
                                ₮{Number(dish.price).toLocaleString()}
                              </span>
                            </div>
                            <p
                              className="text-xs line-clamp-2"
                              style={{ color: "#8a6a4a" }}
                            >
                              {dish.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Dish Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(44,26,14,0.5)" }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-md shadow-2xl"
            style={{ backgroundColor: "#fff8f2" }}
          >
            <h2 className="text-lg font-bold mb-1" style={{ color: "#2c1a0e" }}>
              {editDish ? "Хоол засах" : "Шинэ хоол нэмэх"}
            </h2>
            <p className="text-xs mb-4" style={{ color: "#8a6a4a" }}>
              {editDish
                ? "Мэдээллийг шинэчлэнэ үү"
                : "Хоолны мэдээллийг бөглөнө үү"}
            </p>
            <div className="space-y-3">
              <input
                placeholder="Хоолны нэр"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  border: "1px solid #e8ddd4",
                  backgroundColor: "#fff",
                  color: "#2c1a0e",
                }}
              />
              <textarea
                placeholder="Тайлбар"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                style={{
                  border: "1px solid #e8ddd4",
                  backgroundColor: "#fff",
                  color: "#2c1a0e",
                }}
              />
              <input
                placeholder="Үнэ (₮)"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                      {imageFile
                        ? imageFile.name
                        : form.image_url
                          ? "Зураг сонгогдсон ✓"
                          : "Зураг сонгох..."}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImageFile(file);
                      setForm({
                        ...form,
                        image_url: URL.createObjectURL(file),
                      });
                    }}
                  />
                </label>
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                )}
              </div>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  border: "1px solid #e8ddd4",
                  backgroundColor: "#fff",
                  color: "#2c1a0e",
                }}
              >
                <option value="">Ангилал сонгох</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  setShowModal(false);
                  setImageFile(null);
                }}
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
                disabled={saving || !form.name || !form.price}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
              >
                {saving ? "Хадгалж байна..." : editDish ? "Хадгалах" : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Modal */}
      {showSlideModal && (
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
                onClick={() => setShowSlideModal(false)}
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
                onClick={handleSaveSlide}
                disabled={savingSlide}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
              >
                {savingSlide ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
