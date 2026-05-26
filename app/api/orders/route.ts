import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const orders = await sql`
      SELECT 
        fo.id,
        fo.user_id,
        u.email as customer_email,
        fo.total_price,
        fo.status,
        fo.created_at,
        u.address as delivery_address,
        json_agg(
          json_build_object(
            'name', d.name,
            'quantity', foi.quantity,
            'image_url', d.image_url
          )
        ) as items,
        COUNT(foi.id) as item_count
      FROM food_orders fo
      LEFT JOIN users u ON fo.user_id = u.id
      LEFT JOIN food_order_items foi ON fo.id = foi.order_id
      LEFT JOIN dishes d ON foi.dish_id = d.id
      GROUP BY fo.id, u.email, u.address
      ORDER BY fo.created_at DESC
    `;
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    await sql`UPDATE food_orders SET status = ${status} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
