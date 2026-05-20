import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const cats = await sql`SELECT * FROM categories ORDER BY id`;
  return Response.json(cats);
}
