/* eslint-disable @next/next/no-img-element */

import { connectDB } from "@/lib/Mongodb";
import Food, { IFood } from "@/models/Food";

 
export default async function LunchSalads() {
  await connectDB();
  const foods = await Food.find({ category: "lunch" }).lean<IFood[]>();
 
  return (
    <div className="py-10">
      <h2 className="text-white text-2xl font-bold mb-8">LunchSalads</h2>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {foods.map((food) => (
          <div key={food._id.toString()} className="bg-white rounded-[32px] p-4 shadow-2xl flex flex-col">
            <div className="relative h-52 w-full rounded-[24px] overflow-hidden mb-4">
              <img
                src={food.img}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-3 right-3 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <span className="text-red-500 text-2xl font-bold">+</span>
              </button>
            </div>
 
            <div className="px-1 flex-grow">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-[#E74C3C] font-bold text-lg leading-tight">
                  {food.name}
                </h3>
                <span className="font-bold text-black text-lg whitespace-nowrap">
                  ${food.price}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}