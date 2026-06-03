import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// Next.js-ийг энэ API-ыг кэшлэхийг хүчээр зогсоох тохиргоо
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await sql`
      SELECT * FROM categories 
      ORDER BY id ASC
    `;

    // Кэш хийлгэхгүйн тулд Header буцаана
    return Response.json(categories, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const result = await sql`
      INSERT INTO categories (name)
      VALUES (${name})
      RETURNING *
    `;

    return Response.json(result[0], {
      status: 201,
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
