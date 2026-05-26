"use server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

export async function updatePasswordAction({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  const records = await sql`
    SELECT * FROM password_reset_tokens WHERE token = ${token}
  `;

  if (records.length === 0) return { error: "Invalid or expired token." };

  const record = records[0];
  if (new Date(record.expires) < new Date()) {
    await sql`DELETE FROM password_reset_tokens WHERE token = ${token}`;
    return { error: "Token has expired. Please request a new one." };
  }

  const hashed = await bcrypt.hash(password, 10);
  await sql`UPDATE users SET password = ${hashed} WHERE email = ${record.email}`;
  await sql`DELETE FROM password_reset_tokens WHERE token = ${token}`;

  return { ok: true };
}
