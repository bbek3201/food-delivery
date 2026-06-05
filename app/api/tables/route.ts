import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const tables = await sql`SELECT * FROM restaurant_tables ORDER BY id ASC`;
  return Response.json(tables);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const qr_token = nanoid(16);
  const result = await sql`
    INSERT INTO restaurant_tables (name, qr_token)
    VALUES (${name}, ${qr_token})
    RETURNING *
  `;
  return Response.json(result[0], { status: 201 });
}
