import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const result = await sql`
    SELECT id, name FROM restaurant_tables WHERE qr_token = ${token} AND is_active = true
  `;
  if (result.length === 0)
    return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(result[0]);
}
