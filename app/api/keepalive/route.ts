import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  await sql`SELECT 1`;
  return Response.json({ ok: true });
}
