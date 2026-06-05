"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Dish = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category_name: string;
};
type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

export default function TablePage() {
  const [showCart, setShowCart] = useState(false);
  const { token } = useParams();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState(false);

  const [tableInfo, setTableInfo] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [invalidTable, setInvalidTable] = useState(false);
  const [lastOrder, setLastOrder] = useState<{
    items: CartItem[];
    total: number;
  } | null>(null);
  const [myOrders, setMyOrders] = useState<CartItem[]>([]);
  const [myTotal, setMyTotal] = useState(0);

  useEffect(() => {
    fetch(`/api/tables/token/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setInvalidTable(true);
          return;
        }
        setTableInfo(data);
      });
    fetch("/api/dishes")
      .then((r) => r.json())
      .then(setDishes);
  }, [token]);

  const addToCart = (dish: Dish | CartItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === dish.id);
      if (existing)
        return prev.map((c) =>
          c.id === dish.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image_url: dish.image_url,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleOrder = async () => {
    if (!customerName.trim()) return alert("Нэрээ оруулна уу");
    if (cart.length === 0) return alert("Хоол сонгоно уу");
    setOrdering(true);
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total_price: total,
        table_id: tableInfo?.id,
        customer_name: customerName,
      }),
    });

    setLastOrder({
      items: [...cart],
      total,
    });

    setMyOrders((prev) => {
      const updated = [...prev];

      cart.forEach((newItem) => {
        const existing = updated.find((i) => i.id === newItem.id);

        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          updated.push({ ...newItem });
        }
      });

      return updated;
    });

    setMyTotal((prev) => prev + total);

    setOrdering(false);

    // ЭНЭ ХОЁРЫГ УСТГА
    // setSuccess(true);
    setCart([]);
  };

  if (invalidTable)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f5f0eb" }}
      >
        <p className="text-lg font-bold" style={{ color: "#2c1a0e" }}>
          QR код хүчингүй байна
        </p>
      </div>
    );

  if (success)
    return (
      <div
        className="min-h-screen flex flex-col items-center py-10 px-4"
        style={{ backgroundColor: "#f5f0eb" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
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

        <h2 className="text-xl font-bold mb-2" style={{ color: "#2c1a0e" }}>
          Захиалга амжилттай!
        </h2>

        <p className="text-sm mb-6" style={{ color: "#8a6a4a" }}>
          {tableInfo?.name} - таны захиалгыг хүлээн авлаа
        </p>

        <div
          className="w-full max-w-md rounded-2xl p-4"
          style={{
            backgroundColor: "#fff8f2",
            border: "1px solid #e8ddd4",
          }}
        >
          <h3 className="font-bold mb-4" style={{ color: "#2c1a0e" }}>
            Таны захиалсан хоолнууд
          </h3>

          {lastOrder?.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#2c1a0e" }}
                >
                  {item.name}
                </p>

                <p className="text-xs" style={{ color: "#8a6a4a" }}>
                  ₮{item.price.toLocaleString()} × {item.quantity}
                </p>
              </div>

              <div className="font-semibold" style={{ color: "#c9a97a" }}>
                ₮{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          <div
            className="mt-4 pt-4 border-t flex justify-between"
            style={{ borderColor: "#e8ddd4" }}
          >
            <span className="font-bold" style={{ color: "#2c1a0e" }}>
              Нийт төлбөр
            </span>

            <span className="font-bold text-lg" style={{ color: "#c9a97a" }}>
              ₮{lastOrder?.total.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setSuccess(false);
            setLastOrder(null);
          }}
          className="mt-6 px-6 py-3 rounded-xl font-semibold"
          style={{
            backgroundColor: "#2c1a0e",
            color: "#f5f0eb",
          }}
        >
          Дахин захиалах
        </button>
      </div>
    );

  const grouped = dishes.reduce(
    (acc, dish) => {
      if (!acc[dish.category_name]) acc[dish.category_name] = [];
      acc[dish.category_name].push(dish);
      return acc;
    },
    {} as Record<string, Dish[]>,
  );

  return (
    <div className="min-h-screen pb-40" style={{ backgroundColor: "#f5f0eb" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
        style={{ backgroundColor: "#2c1a0e" }}
      >
        <img
          src="/mainlogo.png"
          alt="logo"
          className="w-10 h-10 object-contain"
        />
        <div>
          <p className="font-bold text-sm" style={{ color: "#f5f0eb" }}>
            МОНГОЛ ХООЛ
          </p>
          <p className="text-xs" style={{ color: "#c9a97a" }}>
            {tableInfo?.name || "..."}
          </p>
        </div>
      </div>

      {/* Customer name */}
      <div className="px-4 py-4">
        <input
          placeholder="Таны нэр"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "#fff8f2",
            border: "1px solid #e8ddd4",
            color: "#2c1a0e",
          }}
        />
      </div>

      {/* Menu */}
      <div className="px-4 space-y-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h3
              className="font-bold text-base mb-3"
              style={{ color: "#2c1a0e" }}
            >
              {cat}
            </h3>
            <div className="space-y-3">
              {items.map((dish) => {
                const cartItem = cart.find((c) => c.id === dish.id);
                return (
                  <div
                    key={dish.id}
                    className="flex gap-3 rounded-2xl p-3"
                    style={{
                      backgroundColor: "#fff8f2",
                      border: "1px solid #e8ddd4",
                    }}
                  >
                    <img
                      src={dish.image_url || "/images/placeholder.png"}
                      alt={dish.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "#2c1a0e" }}
                      >
                        {dish.name}
                      </p>
                      <p
                        className="text-xs mt-0.5 line-clamp-2"
                        style={{ color: "#8a6a4a" }}
                      >
                        {dish.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className="font-bold text-sm"
                          style={{ color: "#c9a97a" }}
                        >
                          ₮{Number(dish.price).toLocaleString()}
                        </span>
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                cartItem.quantity === 1
                                  ? removeFromCart(dish.id)
                                  : setCart((prev) =>
                                      prev.map((c) =>
                                        c.id === dish.id
                                          ? { ...c, quantity: c.quantity - 1 }
                                          : c,
                                      ),
                                    )
                              }
                              className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                              style={{
                                backgroundColor: "#e8ddd4",
                                color: "#2c1a0e",
                              }}
                            >
                              −
                            </button>
                            <span
                              className="text-sm font-bold w-4 text-center"
                              style={{ color: "#2c1a0e" }}
                            >
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(dish)}
                              className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                              style={{
                                backgroundColor: "#2c1a0e",
                                color: "#f5f0eb",
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(dish)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{
                              backgroundColor: "#2c1a0e",
                              color: "#f5f0eb",
                            }}
                          >
                            Нэмэх
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {myOrders.length > 0 && (
        <div className="px-4 mt-6">
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#fff8f2",
              border: "1px solid #e8ddd4",
            }}
          >
            <h3 className="font-bold mb-4" style={{ color: "#2c1a0e" }}>
              Өмнө захиалсан хоолнууд
            </h3>

            {myOrders.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#2c1a0e" }}
                  >
                    {item.name}
                  </p>

                  <p className="text-xs" style={{ color: "#8a6a4a" }}>
                    {item.quantity} ш
                  </p>
                </div>

                <div className="font-semibold" style={{ color: "#c9a97a" }}>
                  ₮{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}

            <div
              className="mt-4 pt-4 border-t flex justify-between"
              style={{ borderColor: "#e8ddd4" }}
            >
              <span className="font-bold" style={{ color: "#2c1a0e" }}>
                Нийт захиалсан
              </span>

              <span className="font-bold text-lg" style={{ color: "#c9a97a" }}>
                ₮{myTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="px-4 mt-6">
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#fff8f2",
              border: "1px solid #e8ddd4",
            }}
          >
            <h3 className="font-bold mb-4" style={{ color: "#2c1a0e" }}>
              Таны захиалга
            </h3>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#2c1a0e" }}
                    >
                      {item.name}
                    </p>

                    <p className="text-xs" style={{ color: "#8a6a4a" }}>
                      ₮{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold" style={{ color: "#c9a97a" }}>
                    ₮{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-4 pt-4 border-t flex justify-between items-center"
              style={{ borderColor: "#e8ddd4" }}
            >
              <span className="font-bold" style={{ color: "#2c1a0e" }}>
                Нийт төлбөр
              </span>

              <span className="text-xl font-bold" style={{ color: "#c9a97a" }}>
                ₮{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Cart bottom bar */}
      {cart.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3"
          style={{ backgroundColor: "#f5f0eb", borderTop: "1px solid #e8ddd4" }}
        >
          <div
            className="flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => setShowCart(true)}
          >
            <span className="text-sm" style={{ color: "#8a6a4a" }}>
              {cart.reduce((s, i) => s + i.quantity, 0)} хоол
            </span>
            <span className="font-bold" style={{ color: "#c9a97a" }}>
              ₮{total.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleOrder}
            disabled={ordering}
            className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-widest uppercase disabled:opacity-50"
            style={{ backgroundColor: "#2c1a0e", color: "#f5f0eb" }}
          >
            {ordering ? "Захиалж байна..." : "Захиалга өгөх"}
          </button>
        </div>
      )}

      {/* Cart Detail Modal */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: "rgba(44,26,14,0.5)" }}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: "#fff8f2" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg" style={{ color: "#2c1a0e" }}>
                Таны захиалга
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-sm"
                style={{ color: "#8a6a4a" }}
              >
                Хаах
              </button>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs" style={{ color: "#8a6a4a" }}>
                      ₮{item.price.toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.quantity === 1
                          ? removeFromCart(item.id)
                          : setCart((prev) =>
                              prev.map((c) =>
                                c.id === item.id
                                  ? { ...c, quantity: c.quantity - 1 }
                                  : c,
                              ),
                            )
                      }
                      className="w-6 h-6 rounded-full bg-gray-200"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 rounded-full bg-gray-800 text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between font-bold text-lg">
              <span style={{ color: "#2c1a0e" }}>Нийт:</span>
              <span style={{ color: "#c9a97a" }}>
                ₮{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
