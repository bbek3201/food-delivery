import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const slides = await sql`SELECT * FROM hero_slides ORDER BY order_index ASC`;
  return Response.json(slides);
}

export async function POST(req: Request) {
  const { image_url, title, subtitle, order_index } = await req.json();
  const result = await sql`
    INSERT INTO hero_slides (image_url, title, subtitle, order_index)
    VALUES (${image_url}, ${title}, ${subtitle}, ${order_index})
    RETURNING *
  `;
  return Response.json(result[0], { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await sql`DELETE FROM hero_slides WHERE id = ${id}`;
  return Response.json({ success: true });
}
