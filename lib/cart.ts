export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: Omit<CartItem, "quantity">) => {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (id: string) => {
  const cart = getCart().filter((c) => c.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => localStorage.removeItem("cart");

export const getCartTotal = () =>
  getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
