/* eslint-disable @next/next/no-img-element */

const lunchFoods = [
  {
    _id: "1",
    name: "Sunshine Stackers",
    price: "12.99",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
  },
  {
    _id: "2",
    name: "Sunshine Stackers",
    price: "12.99",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
  },
  {
    _id: "3",
    name: "Sunshine Stackers",
    price: "12.99",
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
  },
  {
    _id: "4",
    name: "Grilled Chicken",
    price: "12.99",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
  },
  {
    _id: "5",
    name: "Beef Steak",
    price: "15.99",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
  },
  {
    _id: "6",
    name: "Pasta Carbonara",
    price: "13.99",
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
  },
];

export default function LunchFavorites() {
  return (
    <section className="py-10">
      <h2 className="text-white text-2xl font-bold mb-8">Lunch favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lunchFoods.map((food) => (
          <div key={food._id} className="bg-white rounded-[32px] p-4 shadow-xl">
            <div className="relative h-48 w-full rounded-[24px] overflow-hidden mb-4">
              <img
                src={food.img}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <span className="text-red-500 text-xl font-bold">+</span>
              </button>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#E74C3C] font-bold text-lg leading-tight">
                  {food.name}
                </h3>
                <span className="font-bold text-black text-lg">
                  ${food.price}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                {food.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
