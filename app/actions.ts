"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// 1. Хэрэглэгч бүртгүүлэх
export async function registerAction(formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirm = formData.get("confirm")?.toString() || "";

  if (!email || !password || !confirm) {
    return { error: "Fill in all fields." };
  }

  if (!emailRegex.test(email)) {
    return { error: "Invalid email. Use a format like example@email.com" };
  }

  if (password !== confirm) {
    return { error: "Those password did’t match, Try again" };
  }

  if (!passwordRegex.test(password)) {
    return {
      error:
        "Password must be at least 8 characters, include a number, capital letter, and a symbol.",
    };
  }

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
      },
    });

    // Зөвхөн бүртгэлийн баталгаажуулалт илгээнэ
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="http://localhost:3000/verify?email=${email}">here</a> to verify your account</p>`,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong, please try again." };
  }

  return { success: true };
}

// 2. Нууц үг сэргээх линк илгээх
export async function sendResetLinkAction(formData: FormData) {
  const email = formData.get("email")?.toString().toLowerCase().trim() || "";

  if (!emailRegex.test(email)) {
    return { error: "Invalid email. Use a format like example@email.com" };
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // ЭНД ХАЯГ ЗӨВ БОЛСОН: ?email=...
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>You requested a password reset. Click the link below to continue:</p>
        <a href="http://localhost:3000/reset-password?email=${email}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "Failed to send reset link. Please try again." };
  }
}

// 3. Нууц үг шинэчлэх
export async function updatePasswordAction(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;

  if (!email || !password) {
    return { error: "Invalid request: Email or password missing." };
  }

  if (!passwordRegex.test(password)) {
    return {
      error:
        "Password must be at least 8 characters, include a number, capital letter, and a symbol.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error("Prisma Update Error:", error);
    return { error: "Failed to update password." };
  }
}
