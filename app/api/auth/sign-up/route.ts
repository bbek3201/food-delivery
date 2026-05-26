import { neon } from "@neondatabase/serverless";
import { nanoid } from "nanoid";
import { hashPassword, signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "И-мэйл болон нууц үг шаардлагатай" },
        { status: 400 },
      );
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Имэйл бүртгэлтэй байна" },
        { status: 400 },
      );
    }

    const hashed = await hashPassword(password);
    const id = nanoid();

    const result = await sql`
      INSERT INTO users (id, email, password)
      VALUES (${id}, ${email}, ${hashed})
      RETURNING id, email, role
    `;

    const token = signToken({ id: result[0].id, role: result[0].role });

    const response = NextResponse.json({ token, user: result[0] });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 хоног
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
