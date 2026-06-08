/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, CartItem } from "@/lib/cart";

type OrderItem = { name: string; quantity: number; image_url: string };
type MyOrder = {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
};
type Props = { open: boolean; onClose: () => void };

const STATUS_MAP: Record<
  string,
  { label: string; style: React.CSSProperties }
> = {
  PENDING: {
    label: "Хүлээгдэж байна",
    style: {
      backgroundColor: "#fffbeb",
      color: "#d97706",
      border: "1px solid #f59e0b",
    },
  },
  DELIVERED: {
    label: "Хүргэгдсэн",
    style: {
      backgroundColor: "#ecfdf5",
      color: "#059669",
      border: "1px solid #10b981",
    },
  },
  CANCELLED: {
    label: "Цуцлагдсан",
    style: {
      backgroundColor: "#f9fafb",
      color: "#6b7280",
      border: "1px solid #d1d5db",
    },
  },
};

export default function CartSidebar({ open, onClose }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tab, setTab] = useState<"cart" | "order">("cart");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myOrders, setMyOrders] = useState<MyOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setItems(getCart());
  }, [open]);

  const fetchMyOrders = async () => {
    setOrdersLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      const res = await fetch(`/api/orders/my?user_id=${user.id}`);
      const data = await res.json();
      setMyOrders(Array.isArray(data) ? data : []);
    }
    setOrdersLoading(false);
  };

  const handleTabChange = (t: "cart" | "order") => {
    setTab(t);
    if (t === "order") fetchMyOrders();
  };

  const remove = (id: string) => {
    removeFromCart(id);
    setItems(getCart());
  };

  const updateQty = (id: string, delta: number) => {
    const cart = getCart();
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    localStorage.setItem("cart", JSON.stringify(cart));
    setItems([...cart]);
  };

  const searchAddress = async (value: string) => {
    setAddress(value);
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&countrycodes=mn`,
        { headers: { "Accept-Language": "mn" } },
      );
      const data = await res.json();
      const results = data.map((d: { display_name: string }) => d.display_name);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setSuggestions([]);
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 0.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!address.trim()) return alert("Хүргэлтийн хаягаа оруулна уу");
    setOrdering(true);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        total_price: subtotal,
        customer_name: user.name || user.email || "Зочин",
        address,
        user_id: user.id, // ← энийг нэм
      }),
    });

    localStorage.removeItem("cart");
    setItems([]);
    setOrdering(false);
    setSuccess(true);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(44,26,14,0.4)" }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 h-full w-105 z-50 shadow-2xl flex flex-col"
        style={{ backgroundColor: "#fff8f2" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #e8ddd4" }}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              style={{ color: "#2c1a0e" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-bold text-base" style={{ color: "#2c1a0e" }}>
              Захиалга
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: "#e8ddd4", color: "#2c1a0e" }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex mx-6 mt-4 rounded-xl overflow-hidden"
          style={{ border: "1px solid #e8ddd4" }}
        >
          <button
            onClick={() => handleTabChange("cart")}
            className="flex-1 py-2.5 text-sm font-bold transition-colors"
            style={
              tab === "cart"
                ? { backgroundColor: "#2c1a0e", color: "#f5f0eb" }
                : { color: "#8a6a4a", backgroundColor: "transparent" }
            }
          >
            Сагс
          </button>
          <button
            onClick={() => handleTabChange("order")}
            className="flex-1 py-2.5 text-sm font-bold transition-colors"
            style={
              tab === "order"
                ? { backgroundColor: "#2c1a0e", color: "#f5f0eb" }
                : { color: "#8a6a4a", backgroundColor: "transparent" }
            }
          >
            Захиалга
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* ORDER TAB */}
          {tab === "order" &&
            (ordersLoading ? (
              <div className="flex justify-center py-10">
                <div
                  className="animate-spin w-6 h-6 border-2 border-t-transparent rounded-full"
                  style={{
                    borderColor: "#c9a97a",
                    borderTopColor: "transparent",
                  }}
                />
              </div>
            ) : myOrders.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-40"
                style={{ color: "#8a6a4a" }}
              >
                <p className="text-sm">Захиалга байхгүй байна</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl p-4 space-y-3"
                    style={{
                      border: "1px solid #e8ddd4",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#8a6a4a" }}>
                        {new Date(order.created_at).toLocaleDateString("mn-MN")}
                      </span>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={
                          STATUS_MAP[order.status]?.style ||
                          STATUS_MAP.PENDING.style
                        }
                      >
                        {STATUS_MAP[order.status]?.label || order.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items?.filter(Boolean).map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <img
                            src={item.image_url || "/images/placeholder.png"}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span
                            className="text-xs flex-1"
                            style={{ color: "#2c1a0e" }}
                          >
                            {item.name}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "#8a6a4a" }}
                          >
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex justify-between pt-2"
                      style={{ borderTop: "1px dashed #e8ddd4" }}
                    >
                      <span className="text-xs" style={{ color: "#8a6a4a" }}>
                        Нийт
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "#c9a97a" }}
                      >
                        ₮{Number(order.total_price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {/* CART TAB */}
          {tab === "cart" &&
            (success ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#ecfdf5" }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: "#059669" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="font-bold text-lg" style={{ color: "#2c1a0e" }}>
                  Захиалга амжилттай!
                </p>
                <p className="text-sm text-center" style={{ color: "#8a6a4a" }}>
                  Таны захиалгыг хүлээн авлаа
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    handleTabChange("order");
                  }}
                  className="text-sm font-bold underline"
                  style={{ color: "#c9a97a" }}
                >
                  Захиалга харах
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                  }}
                  className="text-sm underline"
                  style={{ color: "#8a6a4a" }}
                >
                  Хаах
                </button>
              </div>
            ) : items.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-40"
                style={{ color: "#8a6a4a" }}
              >
                <p className="text-sm">Сагс хоосон байна</p>
              </div>
            ) : (
              <>
                <p className="font-bold text-sm" style={{ color: "#2c1a0e" }}>
                  Миний сагс
                </p>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-2xl"
                      style={{
                        border: "1px dashed #e8ddd4",
                        backgroundColor: "#fff",
                      }}
                    >
                      <img
                        src={item.image_url || "/images/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p
                            className="font-bold text-sm leading-tight"
                            style={{ color: "#2c1a0e" }}
                          >
                            {item.name}
                          </p>
                          <button
                            onClick={() => remove(item.id)}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-sm shrink-0 ml-1"
                            style={{
                              backgroundColor: "#e8ddd4",
                              color: "#8a6a4a",
                            }}
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold"
                              style={{
                                backgroundColor: "#e8ddd4",
                                color: "#2c1a0e",
                              }}
                            >
                              −
                            </button>
                            <span
                              className="text-sm font-bold w-5 text-center"
                              style={{ color: "#2c1a0e" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold"
                              style={{
                                backgroundColor: "#2c1a0e",
                                color: "#f5f0eb",
                              }}
                            >
                              +
                            </button>
                          </div>
                          <span
                            className="font-bold text-sm"
                            style={{ color: "#c9a97a" }}
                          >
                            ₮{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div>
                  <p
                    className="font-bold text-sm mb-2"
                    style={{ color: "#2c1a0e" }}
                  >
                    Хүргэлтийн хаяг
                  </p>
                  <div className="relative">
                    <input
                      value={address}
                      onChange={(e) => searchAddress(e.target.value)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      }
                      onFocus={() =>
                        suggestions.length > 0 && setShowSuggestions(true)
                      }
                      placeholder="Хаяг хайх... (жишээ: Сүхбаатар дүүрэг)"
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        border: "1px solid #e8ddd4",
                        backgroundColor: "#fff",
                        color: "#2c1a0e",
                      }}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        className="absolute z-10 w-full rounded-xl shadow-lg mt-1 overflow-hidden"
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #e8ddd4",
                        }}
                      >
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setAddress(s);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-amber-50 last:border-0"
                            style={{
                              color: "#2c1a0e",
                              borderBottom: "1px solid #f0e8df",
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment summary */}
                <div
                  className="rounded-2xl p-4 space-y-2"
                  style={{ backgroundColor: "#f5f0eb" }}
                >
                  <p
                    className="font-bold text-sm mb-3"
                    style={{ color: "#2c1a0e" }}
                  >
                    Захиалга
                  </p>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span style={{ color: "#8a6a4a" }}>
                        {item.name} x{item.quantity}
                      </span>
                      <span style={{ color: "#2c1a0e" }}>
                        ₮{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{ borderTop: "1px dashed #e8ddd4", margin: "8px 0" }}
                  />
                  <div className="flex justify-between font-bold text-base">
                    <span style={{ color: "#2c1a0e" }}>Нийт дүн</span>
                    <span style={{ color: "#c9a97a" }}>
                      ₮{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            ))}
        </div>

        {tab === "cart" && !success && items.length > 0 && (
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={handleCheckout}
              disabled={ordering}
              className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
            >
              {ordering ? "Захиалж байна..." : "Захиалга илгээх"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
