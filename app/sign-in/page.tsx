/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const validateEmail = (value: string) => {
    if (!value) setEmailError("И-мэйл хаяг оруулна уу");
    else if (!EMAIL_REGEX.test(value))
      setEmailError("И-мэйл хаяг буруу байна.");
    else setEmailError("");
  };

  const validatePassword = (value: string) => {
    if (!value) setPasswordError("Нууц үг оруулна уу");
    else if (value.length < 8)
      setPasswordError("Нууц үг хамгийн багадаа 8 тэмдэгт");
    else if (!PASSWORD_REGEX.test(value))
      setPasswordError("Том, жижиг үсэг, тоо агуулна уу");
    else setPasswordError("");
  };

  const isFormValid =
    EMAIL_REGEX.test(email) &&
    PASSWORD_REGEX.test(password) &&
    !emailError &&
    !passwordError;

  const handleSubmit = async () => {
    validateEmail(email);
    validatePassword(password);
    if (!isFormValid) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push(data.user.role === "ADMIN" ? "/admin" : "/");
    } else {
      setError(data.error || "Нэвтрэхэд алдаа гарлаа");
    }
  };

  const inputBase =
    "w-full bg-white border-[1.5px] rounded-xl px-4 py-3 outline-none text-[#3D2B1A] placeholder:text-[#C4A882]";

  return (
    <div className="flex h-screen font-sans">
      <div className="w-1/2 flex flex-col justify-center px-12 bg-[#F5EFE6]">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center border border-[#D4BFA0] rounded-lg mb-8 text-[#8B5E34]"
        >
          ‹
        </button>

        <p className="text-sm text-[#7A5C3A] mb-8">
          Бүртгэлээ үүсгээд нэвтэрч захиалгаа хийгээрэй.
        </p>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="И-мэйл хаяг"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            className={`${inputBase} ${emailError ? "border-[#C0392B]" : "border-[#D4BFA0]"}`}
          />
          {emailError && (
            <p className="text-[#C0392B] text-xs mt-1">⚠️ {emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            className={`${inputBase} ${passwordError ? "border-[#C0392B]" : "border-[#D4BFA0]"}`}
          />
          {passwordError && (
            <p className="text-[#C0392B] text-xs mt-1">⚠️ {passwordError}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-xs text-[#7A5C3A] cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="accent-[#8B5E34]"
            />
            Нууц үг харуулах
          </label>
          <a
            href="/forgot-password"
            className="text-xs text-[#8B5E34] font-bold hover:underline"
          >
            Нууц үг мартсан уу?
          </a>
        </div>

        {error && (
          <p className="text-[#C0392B] text-xs bg-[#FDECEA] p-2 rounded-lg mb-2">
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition ${isFormValid ? "bg-[#8B5E34] text-white" : "bg-[#D4BFA0] text-white/60 cursor-not-allowed"}`}
        >
          {loading ? "Уншиж байна..." : "Нэвтрэх →"}
        </button>

        <p className="text-center mt-5 text-sm text-[#7A5C3A]">
          Бүртгэл байхгүй юу?{" "}
          <a
            href="/sign-up"
            className="text-[#8B5E34] font-bold hover:underline"
          >
            Бүртгүүлэх
          </a>
        </p>
      </div>

      <div className="w-1/2 bg-[#3D2B1A]">
        <img
          src="hool.png"
          alt="Монгол хоол"
          className="w-full h-full object-cover opacity-80"
        />
      </div>
    </div>
  );
}
