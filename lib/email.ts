import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, resetLink: string) {
  await resend.emails.send({
    from: "Монгол Хоол <onboarding@resend.dev>", // Эхлээд resend-ийн өгсөн имэйлийг ашиглана
    to: email,
    subject: "Нууц үг сэргээх хүсэлт",
    html: `<p>Сайн байна уу? Та нууц үгээ сэргээх бол доорх линк дээр дарна уу:</p>
           <a href="${resetLink}">Нууц үг солих</a>`,
  });
}
