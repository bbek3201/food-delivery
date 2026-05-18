/* eslint-disable @typescript-eslint/no-unused-vars */


import mongoose, { Schema, model, models } from "mongoose";
 
export interface IFood {
  _id: string;
  name: string;
  price: string;
  img: string;
  description: string;
  category: "appetizer" | "salad" | "lunch";
}
 
const FoodSchema = new Schema<IFood>({
  name: { type: String, required: true },
  price: { type: String, required: true },
  img: { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    enum: ["appetizer", "salad", "lunch"],
    required: true,
  },
});
 
const Food = models.Food || model<IFood>("Food", FoodSchema);
 
export default Food;