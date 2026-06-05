/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = { name: string; quantity: number; image_url: string };
type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  table_name: string;
  total_price: number;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  created_at: string;
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
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("API хүсэлт амжилтгүй");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const toggleSelect = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  const toggleAll = () =>
    setSelected(
      selected.length === paginated.length ? [] : paginated.map((o) => o.id),
    );

  const updateStatus = async (id: string, status: string) => {
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
  };

  const deleteOrder = async (id: string, skipConfirm = false) => {
    if (!skipConfirm && !confirm("Захиалгыг устгах уу?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setSelected((prev) => prev.filter((s) => s !== id));
    }
  };

  const deleteSelected = async () => {
    if (!confirm(`${selected.length} захиалгыг устгах уу?`)) return;
    await Promise.all(selected.map((id) => deleteOrder(id, true)));
    setSelected([]);
  };

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
            onClick={() => router.push("/admin?tab=menu")}
            className="w-full px-4 py-3 rounded-xl text-sm hover:bg-white/10 text-left"
            style={{ color: "#c9a97a" }}
          >
            Хоолны цэс
          </button>
          <button
            onClick={() => router.push("/admin/hero")}
            className="w-full px-4 py-3 rounded-xl text-sm hover:bg-white/10 text-left"
            style={{ color: "#c9a97a" }}
          >
            Hero слайд
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-left"
            style={{ backgroundColor: "#c9a97a", color: "#2c1a0e" }}
          >
            Захиалгууд
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#2c1a0e" }}>
              Захиалгууд
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#8a6a4a" }}>
              {orders.length} нийт захиалга
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэрээр хайх..."
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                border: "1px solid #e8ddd4",
                backgroundColor: "#fff8f2",
                color: "#2c1a0e",
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                border: "1px solid #e8ddd4",
                backgroundColor: "#fff8f2",
                color: "#2c1a0e",
              }}
            >
              <option value="ALL">Бүгд</option>
              <option value="PENDING">Хүлээгдэж байна</option>
              <option value="DELIVERED">Хүргэгдсэн</option>
              <option value="CANCELLED">Цуцлагдсан</option>
            </select>
            {selected.length > 0 && (
              <>
                <button
                  onClick={() => {
                    selected.forEach((id) => updateStatus(id, "DELIVERED"));
                    setSelected([]);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "#059669", color: "#fff" }}
                >
                  Хүргэгдсэн ({selected.length})
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

        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ backgroundColor: "#fff8f2", border: "1px solid #e8ddd4" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e8ddd4" }}>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={
                      paginated.length > 0 &&
                      selected.length === paginated.length
                    }
                  />
                </th>
                {[
                  "№",
                  "Нэр",
                  "Ширээ",
                  "Хоол",
                  "Огноо",
                  "Нийт үнэ",
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
              {paginated.length > 0 ? (
                paginated.map((order, idx) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #f0e8df" }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-black">
                      {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-black">
                      {order.customer_name || order.customer_email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-black">
                      {order.table_name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetailOrder(order)}
                        style={{ color: "#8a6a4a" }}
                      >
                        {order.item_count} хоол
                      </button>
                    </td>
                    <td className="px-4 py-3 text-black">
                      {new Date(order.created_at).toLocaleDateString("mn-MN")}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold"
                      style={{ color: "#c9a97a" }}
                    >
                      ₮{Number(order.total_price || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={
                          STATUS_STYLES[order.status]?.style ||
                          STATUS_STYLES.PENDING.style
                        }
                        className="px-2 py-1 rounded-full cursor-pointer outline-none text-xs"
                      >
                        <option value="PENDING">Хүлээгдэж байна</option>
                        <option value="DELIVERED">Хүргэгдсэн</option>
                        <option value="CANCELLED">Цуцлагдсан</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-400 text-xs"
                      >
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
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
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium"
                  style={
                    page === p
                      ? { backgroundColor: "#2c1a0e", color: "#f5f0eb" }
                      : { color: "#8a6a4a" }
                  }
                >
                  {p}
                </button>
              ))}
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
                ✕
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8a6a4a" }}>Нэр</span>
                <span style={{ color: "#2c1a0e" }}>
                  {detailOrder.customer_name || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8a6a4a" }}>Ширээ</span>
                <span style={{ color: "#2c1a0e" }}>
                  {detailOrder.table_name || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#8a6a4a" }}>Огноо</span>
                <span style={{ color: "#2c1a0e" }}>
                  {new Date(detailOrder.created_at).toLocaleString("mn-MN")}
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
