"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("И-мэйл хаяг оруулна уу");
    } else if (!EMAIL_REGEX.test(value)) {
      setEmailError("И-мэйл хаяг буруу байна.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    validateEmail(email);
    if (!email || emailError) return;

    setLoading(true);
    // Энд чиний API дуудна (Жишээ нь: /api/auth/forgot-password)
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
    }
  };

  return (
    <div className="flex h-screen font-sans">
      <div className="w-1/2 flex flex-col justify-center px-12 bg-[#F5EFE6]">
        <button onClick={() => router.back()} className="mb-8 text-[#8B5E34]">
          ‹ Буцах
        </button>

        <h1 className="text-3xl font-bold text-[#3D2B1A] mb-2">
          Нууц үг сэргээх
        </h1>
        <p className="text-sm text-[#7A5C3A] mb-8">
          И-мэйл хаягаа оруулна уу, бид танд нууц үг сэргээх линк илгээх болно.
        </p>

        {success ? (
          <div className="bg-[#E8F8F0] p-4 rounded-xl text-[#27AE60] text-sm font-semibold">
            И-мэйл илгээгдлээ! Та и-мэйлээ шалгана уу.
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#7A5C3A] uppercase tracking-wider mb-2">
                И-мэйл хаяг
              </label>
              <input
                type="email"
                placeholder="tanii@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className={`w-full bg-white border-[1.5px] rounded-xl px-4 py-3 outline-none ${
                  emailError ? "border-[#C0392B]" : "border-[#D4BFA0]"
                }`}
              />
              {emailError && (
                <p className="text-[#C0392B] text-xs mt-1.5">⚠️ {emailError}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !email || !!emailError}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#8B5E34] text-[#F5EFE6] disabled:bg-[#D4BFA0]"
            >
              {loading ? "Илгээж байна..." : "Сэргээх линк илгээх →"}
            </button>
          </>
        )}

        <p className="text-center mt-5 text-sm text-[#7A5C3A]">
          Буцаад{" "}
          <a href="/sign-in" className="text-[#8B5E34] font-bold">
            Нэвтрэх
          </a>
        </p>
      </div>

      {/* Баруун талын зураг хэвээрээ */}
      <div className="w-1/2 relative overflow-hidden bg-[#3D2B1A]">
        <img
          src="hool.png"
          alt="Монгол хоол"
          className="w-full h-full object-cover opacity-80"
        />
      </div>
    </div>
  );
}
