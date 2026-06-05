/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };
type Dish = {
  id: string;
  name: string;
  description: string;
  ingredients: string; // 1. Энд найрлага талбарыг нэмлээ
  price: number;
  image_url: string;
  category_id: number;
  category_name: string;
  is_active: boolean; // 2. Идэвхтэй эсэх талбарыг нэмж өгнө
};

export default function FoodMenuPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);
  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 2. Form state дотор ingredients-ийг нэмж өгөв
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: "",
    price: "",
    image_url: "",
    category_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeCat
      ? `/api/dishes?category_id=${activeCat}&admin=true`
      : "/api/dishes?admin=true";
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setDishes(Array.isArray(data) ? data : []))
      .catch(() => setDishes([]))
      .finally(() => setLoading(false));
  }, [activeCat]);

  const grouped = categories.map((cat) => ({
    ...cat,
    dishes: dishes.filter((d) => d.category_id === cat.id),
  }));

  // 3. Шинээр хоол нэмэх үед найрлагыг хоосон болгож цэвэрлэнэ
  const openAdd = (category_id: number) => {
    setEditDish(null);
    setImageFile(null);
    setForm({
      name: "",
      description: "",
      ingredients: "",
      price: "",
      image_url: "",
      category_id: String(category_id),
    });
    setShowModal(true);
  };

  // 4. Засах үед байгаа найрлагыг form руу дуудаж оруулна
  const openEdit = (dish: Dish) => {
    setEditDish(dish);
    setImageFile(null);
    setForm({
      name: dish.name,
      description: dish.description || "",
      ingredients: dish.ingredients || "",
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

    // Энд бүх талбарыг (нэр, тайлбар, үнэ, зураг, найрлага) нэгтгэж байна
    const body = {
      name: form.name,
      description: form.description,
      ingredients: form.ingredients, // <-- Энэ мөр засах үед найрлагыг дамжуулна!
      price: parseFloat(form.price),
      image_url: finalImageUrl,
      category_id: parseInt(form.category_id),
    };

    if (editDish) {
      // Засах хүсэлт (PATCH)
      await fetch(`/api/dishes/${editDish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), // Бэлдсэн body-г бүхлээр нь илгээнэ
      });
    } else {
      // Шинээр нэмэх хүсэлт (POST)
      await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    setShowModal(false);
    setImageFile(null);

    // Жагсаалтыг дахин шинэчлэх
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

  const handleAddCategory = async () => {
    if (!catName.trim()) return;
    setSavingCat(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catName.trim() }),
    });
    const cat = await res.json();
    setCategories((prev) => [...prev, cat]);
    setCatName("");
    setSavingCat(false);
    setShowCatModal(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Ангилал устгах уу? Дотор хоолнууд ч устана.")) return;
    setDeletingCatId(id);
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDishes((prev) => prev.filter((d) => d.category_id !== id));
    if (activeCat === id) setActiveCat(null);
    setDeletingCatId(null);
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
        <button
          onClick={() => router.push("/")}
          className="mb-10 group relative"
        >
          <img
            src="/mainlogo.png"
            alt="logo"
            className="w-16 h-16 object-contain mx-auto"
          />
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(201,169,122,0.15)" }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "#c9a97a" }}
            >
              Нүүр хуудас
            </span>
          </div>
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Хоолны цэс
          </button>
          <button
            onClick={() => router.push("/admin/hero")}
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
              Хоолны ангилал
            </h1>
            <p className="text-sm" style={{ color: "#8a6a4a" }}>
              Хоол нэмэх, засах, устгах
            </p>
          </div>
          <button
            onClick={() => {
              setCatName("");
              setShowCatModal(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
          >
            + Ангилал нэмэх
          </button>
        </div>

        {/* Category filters */}
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
            <div
              key={cat.id}
              className="relative group/cat flex items-center gap-1"
            >
              <button
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
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                disabled={deletingCatId === cat.id}
                className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity"
                style={{ backgroundColor: "#dc2626", color: "#fff" }}
                title="Устгах"
              >
                <svg
                  className="w-3 h-3"
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
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
              style={{ borderColor: "#c9a97a", borderTopColor: "transparent" }}
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
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#c9a97a" }}
                    >
                      <span className="text-white text-xl font-light">+</span>
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
                        {!dish.is_active && (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: "rgba(44,26,14,0.6)" }}
                          >
                            <span
                              className="text-xs font-bold text-white px-2 py-1 rounded-lg"
                              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                            >
                              Идэвхгүй хоол
                            </span>
                          </div>
                        )}
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
                        <button
                          onClick={async () => {
                            await fetch(`/api/dishes/${dish.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                ...dish,
                                is_active: !dish.is_active,
                              }),
                            });
                            const url = activeCat
                              ? `/api/dishes?category_id=${activeCat}&admin=true`
                              : "/api/dishes?admin=true";
                            fetch(url)
                              .then((r) => r.json())
                              .then(setDishes);
                          }}
                          className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          title={
                            dish.is_active
                              ? "Идэвхгүй болгох"
                              : "Идэвхтэй болгох"
                          }
                        >
                          <span
                            style={{
                              fontSize: 14,
                              color: dish.is_active ? "#22c55e" : "#dc2626",
                            }}
                          >
                            {dish.is_active ? "✓" : "✗"}
                          </span>
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
      </main>

      {/* Category Modal */}
      {showCatModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(44,26,14,0.5)" }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            style={{ backgroundColor: "#fff8f2" }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "#2c1a0e" }}>
              Шинэ ангилал нэмэх
            </h2>
            <input
              placeholder="Ангилалын нэр"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              autoFocus
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none mb-4"
              style={{
                border: "1px solid #e8ddd4",
                backgroundColor: "#fff",
                color: "#2c1a0e",
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCatModal(false)}
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
                onClick={handleAddCategory}
                disabled={savingCat || !catName.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
              >
                {savingCat ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* 5. НАЙРЛАГА ОРУУЛАХ ТАЛБАРЫГ ЭНД НЭМЛЭЭ */}
              <textarea
                placeholder="Найрлага (Жишээ нь: Үхрийн мах, сонгино, гурил...)"
                value={form.ingredients}
                onChange={(e) =>
                  setForm({ ...form, ingredients: e.target.value })
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
    </div>
  );
}
