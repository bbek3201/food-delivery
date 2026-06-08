import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }

    const orders = await sql`
      SELECT 
        fo.id, 
        fo.total_price, 
        fo.status, 
        fo.created_at,
        fo.customer_name,
        fo.delivery_address,
        fo.table_id,
        rt.name AS table_name,
        u.email AS customer_email,
        COALESCE(json_agg(
          json_build_object(
            'name', d.name, 
            'quantity', foi.quantity, 
            'image_url', d.image_url
          )
        ) FILTER (WHERE d.id IS NOT NULL), '[]') AS items,
        COUNT(foi.id)::int AS item_count
      FROM food_orders fo
      LEFT JOIN food_order_items foi ON fo.id = foi.order_id
      LEFT JOIN dishes d ON foi.dish_id = d.id
      LEFT JOIN users u ON fo.user_id = u.id
      LEFT JOIN restaurant_tables rt ON fo.table_id = rt.id
      WHERE fo.user_id = ${userId}
      GROUP BY fo.id, u.email, rt.name
      ORDER BY fo.created_at DESC
    `;
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
