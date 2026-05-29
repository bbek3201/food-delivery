import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  if (!user_id) return NextResponse.json([]);

  const orders = await sql`
    SELECT 
      fo.id, fo.total_price, fo.status, fo.created_at,
      json_agg(json_build_object(
        'name', d.name, 'quantity', foi.quantity, 'image_url', d.image_url
      )) as items
    FROM food_orders fo
    LEFT JOIN food_order_items foi ON fo.id = foi.order_id
    LEFT JOIN dishes d ON foi.dish_id = d.id
    WHERE fo.user_id = ${user_id}
    GROUP BY fo.id
    ORDER BY fo.created_at DESC
  `;
  return NextResponse.json(orders);
}
