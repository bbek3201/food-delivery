/* eslint-disable @typescript-eslint/no-explicit-any */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { name, description, ingredients, price, image_url, category_id } =
      await req.json();

    if (!name || !price) {
      return Response.json(
        { error: "Name and Price are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE dishes 
      SET 
        name = ${name}, 
        ingredients = ${ingredients ? JSON.stringify(ingredients) : null},
        description = ${description}, 
        price = ${parseFloat(price)}, 
        image_url = ${image_url}, 
        category_id = ${category_id ? parseInt(category_id) : null}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return Response.json({ error: "Dish not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM dishes
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return Response.json({ error: "Dish not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Dish deleted successfully",
      deletedDish: result[0],
    });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
