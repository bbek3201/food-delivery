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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        user_id: user.id,
        items,
        total_price: total,
        address,
      }),
    });
    localStorage.removeItem("cart");
    setItems([]);
    setOrdering(false);
    setSuccess(true);
  };

  const statusStyle = (s: string) =>
    s === "PENDING"
      ? "bg-orange-100 text-orange-500"
      : s === "DELIVERED"
        ? "bg-green-100 text-green-600"
        : "bg-gray-100 text-gray-500";

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-700"
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
            <span className="font-bold text-gray-900">Order detail</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mt-4 rounded-xl overflow-hidden border border-gray-100">
          <button
            onClick={() => handleTabChange("cart")}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${tab === "cart" ? "bg-red-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Cart
          </button>
          <button
            onClick={() => handleTabChange("order")}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${tab === "order" ? "bg-red-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Order
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* ORDER TAB */}
          {tab === "order" &&
            (ordersLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full" />
              </div>
            ) : myOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="text-sm">Захиалга байхгүй байна</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-100 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle(order.status)}`}
                      >
                        {order.status}
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
                          <span className="text-xs text-gray-700 flex-1">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between border-t border-gray-50 pt-2">
                      <span className="text-xs text-gray-400">Нийт</span>
                      <span className="text-sm font-bold text-gray-900">
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
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-500"
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
                <p className="font-bold text-gray-900">Захиалга амжилттай!</p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    handleTabChange("order");
                  }}
                  className="text-sm text-red-500 font-bold underline"
                >
                  Захиалга харах
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                  }}
                  className="text-sm text-gray-400 underline"
                >
                  Хаах
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="text-sm">Сагс хоосон байна</p>
              </div>
            ) : (
              <>
                <p className="font-bold text-gray-900 text-sm">My cart</p>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 border border-dashed border-gray-200 rounded-2xl"
                    >
                      <img
                        src={item.image_url || "/images/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="font-bold text-red-500 text-sm leading-tight">
                            {item.name}
                          </p>
                          <button
                            onClick={() => remove(item.id)}
                            className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0 ml-1"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-red-500 text-lg font-bold"
                            >
                              −
                            </button>
                            <span className="text-sm font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-red-500 text-lg font-bold"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">
                            ₮{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-bold text-gray-900 text-sm mb-2">
                    Delivery location
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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 text-gray-600 placeholder:text-gray-300"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setAddress(s);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <p className="font-bold text-gray-900 text-sm mb-3">
                    Payment info
                  </p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items</span>
                    <span>₮{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 my-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>₮{shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 my-2" />
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>₮{total.toLocaleString()}</span>
                  </div>
                </div>
              </>
            ))}
        </div>

        {tab === "cart" && !success && items.length > 0 && (
          <div className="px-6 pb-6">
            <button
              onClick={handleCheckout}
              disabled={ordering}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              {ordering ? "Захиалж байна..." : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
