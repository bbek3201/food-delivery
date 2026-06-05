import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { sendResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import { nanoid } from "nanoid";

// 1. ЗАСВАР: neon функцэд DATABASE_URL-ыг ашиглах нь зөв
const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const users = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);
    const id = nanoid();

    await sql`
      INSERT INTO password_reset_tokens (id, email, token, expires)
      VALUES (${id}, ${email}, ${token}, ${expires})
    `;

    // 2. ЗАСВАР: Энд Vercel-ийн Environment Variable-аа ашиглах
    // Тэмдэглэл: Энэ хувьсагч Vercel-ийн settings-д зөв тохируулагдсан байх ёстой
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://food-delivery-three-psi.vercel.app";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await sendResetEmail(email, resetLink);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
