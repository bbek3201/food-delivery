"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

type Table = { id: number; name: string; qr_token: string; is_active: boolean };

export default function TablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});

  useEffect(() => {
    fetch("/api/tables")
      .then((r) => r.json())
      .then((data) => {
        setTables(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    tables.forEach((table) => {
      const canvas = canvasRefs.current[table.id];
      if (canvas) {
        const url = `${window.location.origin}/table/${table.qr_token}`;
        QRCode.toCanvas(canvas, url, {
          width: 160,
          margin: 1,
          color: { dark: "#2c1a0e", light: "#fff8f2" },
        });
      }
    });
  }, [tables]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const table = await res.json();
    setTables((prev) => [...prev, table]);
    setNewName("");
    setAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Устгах уу?")) return;
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePrint = (table: Table) => {
    const canvas = canvasRefs.current[table.id];
    if (!canvas) return;
    const url = canvas.toDataURL();
    const win = window.open("");
    win?.document.write(`
      <html><body style="display:flex;flex-direction:column;align-items:center;padding:40px;font-family:sans-serif">
        <h2 style="color:#2c1a0e">${table.name}</h2>
        <img src="${url}" style="width:200px;height:200px"/>
        <p style="color:#8a6a4a;margin-top:16px">QR кодыг уншуулж захиалга өгнө үү</p>
      </body></html>
    `);
    win?.print();
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-white/10"
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-white/10"
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
                d="M3 10h18M3 6h18M3 14h18M3 18h18"
              />
            </svg>
            Ширээ / QR
          </button>

          <button
            onClick={() => router.push("/orders")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-white/10"
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

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#2c1a0e" }}>
              Ширээ / QR код
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8a6a4a" }}>
              Ширээ нэмж QR код үүсгэнэ
            </p>
          </div>
        </div>

        {/* Add table */}
        <div className="flex gap-3 mb-8">
          <input
            placeholder="Ширээний нэр (жишээ: Ширээ 1)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "#fff8f2",
              border: "1px solid #e8ddd4",
              color: "#2c1a0e",
            }}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
          >
            + Нэмэх
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full"
              style={{ borderColor: "#c9a97a", borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className="rounded-2xl p-4 flex flex-col items-center gap-3"
                style={{
                  backgroundColor: "#fff8f2",
                  border: "1px solid #e8ddd4",
                }}
              >
                <p className="font-bold text-sm" style={{ color: "#2c1a0e" }}>
                  {table.name}
                </p>
                <canvas
                  ref={(el) => {
                    canvasRefs.current[table.id] = el;
                  }}
                  className="rounded-xl"
                />
                <p
                  className="text-xs text-center break-all"
                  style={{ color: "#8a6a4a" }}
                >
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/table/${table.qr_token}`
                    : ""}
                </p>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => handlePrint(table)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold"
                    style={{ backgroundColor: "#e8ddd4", color: "#2c1a0e" }}
                  >
                    🖨️ Хэвлэх
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold"
                    style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
                  >
                    Устгах
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
