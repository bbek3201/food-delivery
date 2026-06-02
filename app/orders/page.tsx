/* eslint-disable @next/next/no-img-element */
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

const STATUS_STYLES: Record<
  string,
  { label: string; style: React.CSSProperties }
> = {
  PENDING: {
    label: "Хүлээгдэж байна",
    style: {
      border: "1px solid #f59e0b",
      color: "#d97706",
      backgroundColor: "#fffbeb",
    },
  },
  DELIVERED: {
    label: "Хүргэгдсэн",
    style: {
      border: "1px solid #10b981",
      color: "#059669",
      backgroundColor: "#ecfdf5",
    },
  },
  CANCELLED: {
    label: "Цуцлагдсан",
    style: {
      border: "1px solid #d1d5db",
      color: "#6b7280",
      backgroundColor: "#f9fafb",
    },
  },
};

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
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

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer_email
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
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

  const deleteOrder = async (id: string) => {
    if (!confirm("Захиалгыг устгах уу?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        setSelected((prev) => prev.filter((s) => s !== id));
      } else {
        alert("Устгахад алдаа гарлаа");
      }
    } catch {
      alert("Сүлжээний алдаа гарлаа");
    } finally {
      setDeletingId(null);
    }
  };

  const deleteSelected = async () => {
    if (!confirm(`${selected.length} захиалгыг устгах уу?`)) return;
    for (const id of selected) await deleteOrder(id);
    setSelected([]);
  };

  const updateSelected = async (status: string) => {
    for (const id of selected) await updateStatus(id, status);
    setSelected([]);
  };

  // Dashboard stats
  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((s, o) => s + Number(o.total_price), 0);
  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f5f0eb" }}
      >
        <div
          className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
          style={{ borderColor: "#c9a97a", borderTopColor: "transparent" }}
        />
      </div>
    );

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
          {/* Хоолны цэс */}
          <button
            onClick={() => router.push("/admin?tab=menu")}
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

          {/* Hero слайд */}
          <button
            onClick={() => router.push("/admin?tab=hero")}
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

          {/* Захиалгууд */}
          <button
            onClick={() => router.push("/orders")}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Захиалгууд
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#2c1a0e" }}>
              Захиалгууд
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#8a6a4a" }}>
              {orders.length} нийт захиалга
            </p>
          </div>
          <div className="flex gap-2">
            {selected.length > 0 && (
              <>
                <button
                  onClick={() => updateSelected("DELIVERED")}
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "#059669", color: "#fff" }}
                >
                  Хүргэгдсэн болгох ({selected.length})
                </button>
                <button
                  onClick={deleteSelected}
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "#dc2626", color: "#fff" }}
                >
                  Устгах ({selected.length})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dashboard stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Нийт захиалга", value: orders.length, icon: "📋" },
            { label: "Өнөөдөр", value: todayOrders, icon: "📅" },
            { label: "Хүлээгдэж байна", value: pendingCount, icon: "⏳" },
            {
              label: "Нийт орлого",
              value: `₮${totalRevenue.toLocaleString()}`,
              icon: "💰",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 shadow-sm"
              style={{
                backgroundColor: "#fff8f2",
                border: "1px solid #e8ddd4",
              }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold" style={{ color: "#2c1a0e" }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#8a6a4a" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#8a6a4a" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              placeholder="Имэйлээр хайх..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "#fff8f2",
                border: "1px solid #e8ddd4",
                color: "#2c1a0e",
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "#fff8f2",
              border: "1px solid #e8ddd4",
              color: "#2c1a0e",
            }}
          >
            <option value="ALL">Бүх төлөв</option>
            <option value="PENDING">Хүлээгдэж байна</option>
            <option value="DELIVERED">Хүргэгдсэн</option>
            <option value="CANCELLED">Цуцлагдсан</option>
          </select>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ backgroundColor: "#fff8f2", border: "1px solid #e8ddd4" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e8ddd4" }}>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === paginated.length &&
                      paginated.length > 0
                    }
                    onChange={toggleAll}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#2c1a0e" }}
                  />
                </th>
                {[
                  "№",
                  "Имэйл",
                  "Хоол",
                  "Огноо",
                  "Нийт үнэ",
                  "Хүргэх хаяг",
                  "Төлөв",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold"
                    style={{ color: "#8a6a4a" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((order, idx) => (
                <tr
                  key={order.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid #f0e8df" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5ede6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="w-4 h-4"
                      style={{ accentColor: "#2c1a0e" }}
                    />
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "#8a6a4a" }}
                  >
                    {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#2c1a0e" }}>
                    {order.customer_email}
                  </td>
                  <td
                    className="px-4 py-3 relative"
                    onMouseEnter={() => setHoveredOrder(order.id)}
                    onMouseLeave={() => setHoveredOrder(null)}
                  >
                    <button
                      onClick={() => setDetailOrder(order)}
                      className="flex items-center gap-1.5"
                      style={{ color: "#8a6a4a" }}
                    >
                      <span>{order.item_count} хоол</span>
                      <svg
                        className="w-3.5 h-3.5"
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
                    </button>
                    {hoveredOrder === order.id && order.items?.length > 0 && (
                      <div
                        className="absolute z-20 left-0 top-full mt-1 rounded-xl shadow-lg p-3 min-w-60"
                        style={{
                          backgroundColor: "#fff8f2",
                          border: "1px solid #e8ddd4",
                        }}
                      >
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
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                                style={{ backgroundColor: "#e8ddd4" }}
                              >
                                🍽️
                              </div>
                            )}
                            <span
                              className="text-sm flex-1"
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
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "#8a6a4a" }}
                  >
                    {new Date(order.created_at).toLocaleDateString("mn-MN")}
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: "#c9a97a" }}
                  >
                    ₮{Number(order.total_price).toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3 text-xs max-w-40 truncate"
                    style={{ color: "#8a6a4a" }}
                  >
                    {order.delivery_address || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="appearance-none text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer outline-none"
                      style={STATUS_STYLES[order.status].style}
                    >
                      <option value="PENDING">Хүлээгдэж байна</option>
                      <option value="DELIVERED">Хүргэгдсэн</option>
                      <option value="CANCELLED">Цуцлагдсан</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailOrder(order)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-amber-50"
                        title="Дэлгэрэнгүй"
                      >
                        <svg
                          className="w-4 h-4"
                          style={{ color: "#c9a97a" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        disabled={deletingId === order.id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                        title="Устгах"
                      >
                        <svg
                          className="w-4 h-4 text-red-400"
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
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-sm"
                    style={{ color: "#8a6a4a" }}
                  >
                    Захиалга олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 py-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30"
                style={{ color: "#8a6a4a" }}
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
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
                  style={
                    page === p
                      ? { backgroundColor: "#2c1a0e", color: "#f5f0eb" }
                      : { color: "#8a6a4a" }
                  }
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="text-sm px-1" style={{ color: "#8a6a4a" }}>
                    ...
                  </span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium"
                    style={
                      page === totalPages
                        ? { backgroundColor: "#2c1a0e", color: "#f5f0eb" }
                        : { color: "#8a6a4a" }
                    }
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30"
                style={{ color: "#8a6a4a" }}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {detailOrder && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(44,26,14,0.5)" }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-md shadow-2xl"
            style={{ backgroundColor: "#fff8f2" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#2c1a0e" }}>
                Захиалгын дэлгэрэнгүй
              </h2>
              <button
                onClick={() => setDetailOrder(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: "#8a6a4a" }}
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
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8a6a4a" }}>Имэйл</span>
                <span style={{ color: "#2c1a0e" }}>
                  {detailOrder.customer_email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8a6a4a" }}>Огноо</span>
                <span style={{ color: "#2c1a0e" }}>
                  {new Date(detailOrder.created_at).toLocaleString("mn-MN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8a6a4a" }}>Хаяг</span>
                <span style={{ color: "#2c1a0e" }}>
                  {detailOrder.delivery_address || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8a6a4a" }}>Нийт үнэ</span>
                <span className="font-bold" style={{ color: "#c9a97a" }}>
                  ₮{Number(detailOrder.total_price).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span style={{ color: "#8a6a4a" }}>Төлөв</span>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={STATUS_STYLES[detailOrder.status].style}
                >
                  {STATUS_STYLES[detailOrder.status].label}
                </span>
              </div>
            </div>
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: "#f5f0eb" }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#8a6a4a" }}
              >
                ЗАХИАЛСАН ХООЛ
              </p>
              {detailOrder.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: "#e8ddd4" }}
                    >
                      🍽️
                    </div>
                  )}
                  <span className="flex-1 text-sm" style={{ color: "#2c1a0e" }}>
                    {item.name}
                  </span>
                  <span className="text-xs" style={{ color: "#8a6a4a" }}>
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setDetailOrder(null)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ border: "1px solid #e8ddd4", color: "#8a6a4a" }}
              >
                Хаах
              </button>
              <button
                onClick={() => {
                  deleteOrder(detailOrder.id);
                  setDetailOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "#dc2626", color: "#fff" }}
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
