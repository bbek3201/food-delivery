import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";
import { hashPassword, signToken } from "@/lib/auth";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  const { email, password, phone, address } = await req.json();

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return Response.json({ error: "Имэйл бүртгэлтэй байна" }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  const id = nanoid();

  const result = await sql`
    INSERT INTO users (id, email, password, phone, address)
    VALUES (${id}, ${email}, ${hashed}, ${phone}, ${address})
    RETURNING id, email, role
  `;

  const token = signToken({ id: result[0].id, role: result[0].role });

  return Response.json({ token, user: result[0] });
}
