import { neon } from "@neondatabase/serverless";
import { comparePassword, signToken } from "@/lib/auth";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (users.length === 0) {
    return Response.json({ error: "Имэйл олдсонгүй" }, { status: 404 });
  }

  const user = users[0];
  const valid = await comparePassword(password, user.password);
  if (!valid) {
    return Response.json({ error: "Нууц үг буруу" }, { status: 401 });
  }

  const token = signToken({ id: user.id, role: user.role });

  return Response.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
}
