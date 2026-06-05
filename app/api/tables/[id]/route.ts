import { neon } from "@neondatabase/serverless";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const { id } = await params;

    await sql`
      DELETE FROM food_order_items
      WHERE order_id = ${id}
    `;

    await sql`
      DELETE FROM food_orders
      WHERE id = ${id}
    `;

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Delete failed",
      },
      { status: 500 },
    );
  }
}
