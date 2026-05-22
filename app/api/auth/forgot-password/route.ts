import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Энд database-ээсээ user байгаа эсэхийг шалгах хэрэгтэй (prisma)
    // const user = await prisma.user.findUnique({ where: { email } });
    // if (!user) return NextResponse.json({ error: "И-мэйл олдсонгүй" }, { status: 404 });

    // 2. И-мэйл илгээх
    const { data, error } = await resend.emails.send({
      from: "Монгол Хоол <onboarding@resend.dev>",
      to: [email],
      subject: "Нууц үг сэргээх",
      html: `<p>Сайн байна уу? Та нууц үгээ сэргээх бол доорх линк дээр дарна уу:</p>
             <a href="http://localhost:3000/reset-password?token=XYZ">Нууц үг солих</a>`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
