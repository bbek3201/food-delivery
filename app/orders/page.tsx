"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = { name: string; quantity: number; image_url: string };
type Order = {
  id: string;
  customer_email: string;
  total_price: number;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  created_at: string;
  delivery_address: string;
  items: OrderItem[];
  item_count: number;
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "border border-orange-400 text-orange-500",
  DELIVERED: "border border-green-500 text-green-600",
  CANCELLED: "border border-gray-300 text-gray-500",
};

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("orders");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginated = orders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleSelect = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  const toggleAll = () =>
    setSelected(
      selected.length === paginated.length ? [] : paginated.map((o) => o.id),
    );

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: status as Order["status"] } : o,
      ),
    );
    setUpdatingId(null);
  };

  const updateSelected = async (status: string) => {
    for (const id of selected) await updateStatus(id, status);
    setSelected([]);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full" />
      </div>
    );

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
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeNav === "menu"
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
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
            onClick={() => setActiveNav("orders")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeNav === "orders"
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
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
      <main className="flex-1 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders.length} items
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              13 June 2023 - 14 July 2023
            </div>
            <button
              disabled={selected.length === 0}
              onClick={() => updateSelected("DELIVERED")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 disabled:cursor-not-allowed hover:enabled:bg-gray-200 transition-colors"
            >
              Change delivery state
            </button>
          </div>
        </div>

        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === paginated.length &&
                      paginated.length > 0
                    }
                    onChange={toggleAll}
                    className="accent-gray-800 w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 w-12">
                  №
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                  Food
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                  <span className="flex items-center gap-1">
                    Date
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
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                  Delivery Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                  <span className="flex items-center gap-1">
                    Delivery state
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
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order, idx) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="accent-gray-800 w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.customer_email}
                  </td>
                  <td
                    className="px-4 py-3 relative"
                    onMouseEnter={() => setHoveredOrder(order.id)}
                    onMouseLeave={() => setHoveredOrder(null)}
                  >
                    <div className="flex items-center gap-1.5 text-gray-600 cursor-default">
                      <span>{order.item_count} foods</span>
                      <svg
                        className="w-3.5 h-3.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {hoveredOrder === order.id && order.items?.length > 0 && (
                      <div className="absolute z-20 left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[240px]">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-1.5"
                          >
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-9 h-9 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                                🍽️
                              </div>
                            )}
                            <span className="text-sm text-gray-700 flex-1">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              x {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-CA")}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    ${Number(order.total_price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[180px] truncate">
                    {order.delivery_address || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full cursor-pointer outline-none bg-white ${STATUS_STYLES[order.status]}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <svg
                        className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 9l4-4 4 4M8 15l4 4 4-4"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 py-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              ‹
            </button>
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                {p}
              </button>
            ))}
            {totalPages > 5 && (
              <>
                <span className="text-gray-400 text-sm px-1">...</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium ${page === totalPages ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
