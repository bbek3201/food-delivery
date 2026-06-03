import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await sql`DELETE FROM dishes WHERE category_id = ${id}`;
  await sql`DELETE FROM categories WHERE id = ${id}`;
  return Response.json({ success: true });
}
