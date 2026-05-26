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

export default function FoodMenuPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
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
      ? `/api/dishes?category_id=${activeCat}`
      : "/api/dishes";

    fetch(url)
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        setDishes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Dishes fetch error:", err);
        setDishes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeCat]);

  const grouped = categories.map((cat) => ({
    ...cat,
    dishes: dishes.filter((d) => d.category_id === cat.id),
  }));

  const openAdd = (category_id: number) => {
    setEditDish(null);
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
    if (editDish) {
      await fetch(`/api/dishes/${editDish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
    } else {
      await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          category_id: parseInt(form.category_id),
        }),
      });
    }
    setSaving(false);
    setShowModal(false);
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
      // 1. URL-ийнх нь араас ID-г нь шууд залгаж явуулна (body болон headers хэрэггүй)
      const res = await fetch(`/api/dishes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 2. Сервер дээр амжилттай устсан тохиолдолд фронт state-ээс хасна
        setDishes((prev) => prev.filter((d) => d.id !== id));
      } else {
        const errorData = await res.json();
        alert(`Устгахад алдаа гарлаа: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete request failed:", error);
      alert("Сүлжээний алдаа гарлаа.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalCount = dishes.length;

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Sidebar */}
      <aside className="w-48 border-r border-gray-100 flex flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <div>
            <button
              onClick={() => router.push("/")}
              className="text-sm font-bold text-gray-900 leading-none"
            >
              NomNom
            </button>
            <p className="text-[10px] text-gray-400">Swift delivery</p>
          </div>
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => router.push("/food-menu")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm bg-gray-900 text-white"
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
            Food menu
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
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
            Orders
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Category filters */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Dishes category
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat(null)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCat === null
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              All Dishes{" "}
              <span className="text-xs opacity-70">{totalCount}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCat === cat.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {cat.name}
                <span className="text-xs opacity-70">
                  {dishes.filter((d) => d.category_id === cat.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dishes by category */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-10">
            {(activeCat
              ? grouped.filter((g) => g.id === activeCat)
              : grouped
            ).map((cat) => (
              <section key={cat.id}>
                <h3 className="text-base font-bold text-gray-800 mb-4">
                  {cat.name}{" "}
                  <span className="text-gray-400 font-normal">
                    ({cat.dishes.length})
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {/* Add new card */}
                  <button
                    onClick={() => openAdd(cat.id)}
                    className="border-2 border-dashed border-red-300 rounded-2xl flex flex-col items-center justify-center gap-2 py-10 hover:border-red-400 hover:bg-red-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-light">+</span>
                    </div>
                    <span className="text-xs text-gray-500 text-center px-2">
                      Add new Dish to {cat.name}
                    </span>
                  </button>

                  {/* Dish cards */}
                  {cat.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
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
                            className="w-3.5 h-3.5 text-gray-600"
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
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {dish.name}
                          </p>
                          <span className="text-sm font-bold text-gray-900 shrink-0">
                            ${Number(dish.price).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-black mb-4">
              {editDish ? "Edit Dish" : "Add New Dish"}
            </h2>
            <div className="space-y-3">
              <input
                placeholder="Dish name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-black focus:border-gray-400"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-black focus:border-gray-400 resize-none"
              />
              <input
                placeholder="Price (e.g. 12.99)"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-black focus:border-gray-400"
              />
              <input
                placeholder="Image URL"
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-black focus:border-gray-400"
              />
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-black focus:border-gray-400"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.price}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Saving..." : editDish ? "Save changes" : "Add dish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
