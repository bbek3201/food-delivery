import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category_id = searchParams.get("category_id");

  const dishes = category_id
    ? await sql`
        SELECT d.*, c.name AS category_name
        FROM dishes d
        LEFT JOIN categories c ON c.id = d.category_id
        WHERE d.category_id = ${category_id}
        ORDER BY d.created_at DESC
      `
    : await sql`
        SELECT d.*, c.name AS category_name
        FROM dishes d
        LEFT JOIN categories c ON c.id = d.category_id
        ORDER BY d.created_at DESC
      `;

  return Response.json(dishes);
}

export async function POST(req: Request) {
  try {
    const { name, description, price, category_id, image_url } =
      await req.json();

    const result = await sql`
      INSERT INTO dishes (
        id,
        name,
        description,
        price,
        category_id,
        image_url
      )
      VALUES (
        ${nanoid()},
        ${name},
        ${description},
        ${price},
        ${Number(category_id)},
        ${image_url}
      )
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/dishes error:", error);

    return Response.json({ error: "Failed to create dish" }, { status: 500 });
  }
}
