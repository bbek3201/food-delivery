import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
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
      GROUP BY fo.id, u.email, rt.name
      ORDER BY fo.created_at DESC
    `;
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total_price, customer_name, address } = body;

    const [order] = await sql`
      INSERT INTO food_orders (total_price, status, created_at, customer_name, delivery_address)
      VALUES (${total_price}, 'PENDING', NOW(), ${customer_name ?? null}, ${address ?? null})
      RETURNING id
    `;

    for (const item of items) {
      await sql`
        INSERT INTO food_order_items (order_id, dish_id, quantity)
        VALUES (${order.id}, ${item.id}, ${item.quantity})
      `;
    }

    return NextResponse.json({ success: true, order_id: order.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    await sql`UPDATE food_orders SET status = ${status} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
