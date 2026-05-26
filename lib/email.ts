import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, resetLink: string) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // Эсвэл таны баталгаажуулсан domain
      to: email,
      subject: "Нууц үг сэргээх",
      html: `<p>Нууц үгээ сэргээхийн тулд <a href="${resetLink}">энд дарна уу</a>.</p>`,
    });
  } catch (error) {
    console.error("Resend API алдаа:", error);
    throw error;
  }
}
