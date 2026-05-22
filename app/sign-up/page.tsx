"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ===== REGEX =====
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const router = useRouter();

  // ===== VALIDATE =====
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("И-мэйл хаяг оруулна уу");
    } else if (!EMAIL_REGEX.test(value)) {
      setEmailError("И-мэйл хаяг буруу байна. Жишээ: name@gmail.com");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Нууц үг оруулна уу");
    } else if (value.length < 8) {
      setPasswordError("Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой");
    } else if (!PASSWORD_REGEX.test(value)) {
      setPasswordError("Том үсэг, жижиг үсэг, тоо агуулсан байх ёстой");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirm = (value: string) => {
    if (!value) {
      setConfirmError("Нууц үгээ давтан оруулна уу");
    } else if (value !== password) {
      setConfirmError("Нууц үг таарахгүй байна");
    } else {
      setConfirmError("");
    }
  };

  const isFormValid =
    EMAIL_REGEX.test(email) &&
    PASSWORD_REGEX.test(password) &&
    confirmPassword === password &&
    !emailError &&
    !passwordError &&
    !confirmError;

  const handleSubmit = async () => {
    validateEmail(email);
    validatePassword(password);
    validateConfirm(confirmPassword);
    if (!isFormValid) return;

    setLoading(true);
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/sign-in");
    } else {
      alert(data.error || "Алдаа гарлаа");
    }
  };

  // Strength тооцоолох
  const strengthChecks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
  ];

  // Input border өнгө
  const inputClass = (value: string, err: string) =>
    `w-full bg-white border-[1.5px] rounded-xl px-4 py-3 text-sm text-[#3D2B1A] placeholder-[#B8A08A] outline-none transition-all ${
      err
        ? "border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/10"
        : value && !err
          ? "border-[#27AE60] focus:ring-2 focus:ring-[#27AE60]/10"
          : "border-[#D4BFA0] focus:border-[#8B5E34] focus:ring-2 focus:ring-[#8B5E34]/10"
    }`;

  return (
    <div className="flex h-screen font-sans">
      {/* ===== ЗҮҮН ТАЛ ===== */}
      <div className="w-1/2 flex flex-col justify-center px-12 bg-[#F5EFE6] overflow-y-auto">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center border border-[#D4BFA0] rounded-lg mb-8 text-[#8B5E34] hover:bg-[#EDE0D0] transition-colors"
        >
          ‹
        </button>

        {/* Лого */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#8B5E34] flex items-center justify-center">
            <span className="text-[#F5EFE6] text-lg font-bold">М</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-[#3D2B1A] tracking-wide">
              МОНГОЛ ХООЛ
            </p>
            <p className="text-[10px] text-[#8B5E34] tracking-wider">
              ҮНДЭСНИЙ ХООЛ
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#3D2B1A] mb-2">
          Бүртгэл үүсгэх
        </h1>
        <p className="text-sm text-[#7A5C3A] mb-8 leading-relaxed">
          Монгол үндэсний хоолыг захиалах дансаа үүсгээрэй.
        </p>

        {/* И-мэйл */}
        <div className="mb-4">
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
            onBlur={() => validateEmail(email)}
            className={inputClass(email, emailError)}
          />
          {emailError && (
            <p className="text-[#C0392B] text-xs mt-1.5 flex items-center gap-1">
              ⚠️ {emailError}
            </p>
          )}
          {email && !emailError && (
            <p className="text-[#27AE60] text-xs mt-1.5 flex items-center gap-1">
              ✓ Зөв формат
            </p>
          )}
        </div>

        {/* Нууц үг */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#7A5C3A] uppercase tracking-wider mb-2">
            Нууц үг
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
              if (confirmPassword) validateConfirm(confirmPassword);
            }}
            onBlur={() => validatePassword(password)}
            className={inputClass(password, passwordError)}
          />
          {passwordError && (
            <p className="text-[#C0392B] text-xs mt-1.5 flex items-center gap-1">
              ⚠️ {passwordError}
            </p>
          )}
          {password && !passwordError && (
            <p className="text-[#27AE60] text-xs mt-1.5 flex items-center gap-1">
              ✓ Нууц үг хүчинтэй
            </p>
          )}
          {/* Strength bar */}
          {password && (
            <div className="flex gap-1 mt-2">
              {strengthChecks.map((met, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    met ? "bg-[#27AE60]" : "bg-[#D4BFA0]"
                  }`}
                />
              ))}
            </div>
          )}
          {/* Strength hint */}
          {password && (
            <p className="text-[#B8A08A] text-[11px] mt-1.5">
              {strengthChecks.filter(Boolean).length === 4
                ? "✓ Хүчтэй нууц үг"
                : `${strengthChecks.filter(Boolean).length}/4 нөхцөл хангагдсан`}
            </p>
          )}
        </div>

        {/* Нууц үг давтах */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#7A5C3A] uppercase tracking-wider mb-2">
            Нууц үг давтах
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirm(e.target.value);
            }}
            onBlur={() => validateConfirm(confirmPassword)}
            className={inputClass(confirmPassword, confirmError)}
          />
          {confirmError && (
            <p className="text-[#C0392B] text-xs mt-1.5 flex items-center gap-1">
              ⚠️ {confirmError}
            </p>
          )}
          {confirmPassword && !confirmError && (
            <p className="text-[#27AE60] text-xs mt-1.5 flex items-center gap-1">
              ✓ Нууц үг таарч байна
            </p>
          )}
        </div>

        {/* Товч */}
        <button
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors ${
            isFormValid
              ? "bg-[#8B5E34] hover:bg-[#704A25] text-[#F5EFE6] cursor-pointer"
              : "bg-[#D4BFA0] text-[#F5EFE6] cursor-not-allowed"
          }`}
        >
          {loading ? "Уншиж байна..." : "Бүртгүүлэх →"}
        </button>

        <p className="text-center mt-5 text-sm text-[#7A5C3A]">
          Аль хэдийн бүртгэлтэй юу?{" "}
          <a
            href="/sign-in"
            className="text-[#8B5E34] font-bold hover:underline"
          >
            Нэвтрэх
          </a>
        </p>

        <div className="flex gap-5 mt-6 pt-5 border-t border-[#D4BFA0]">
          {[
            { icon: "🛡️", label: "Аюулгүй" },
            { icon: "🚚", label: "Хурдан хүргэлт" },
            { icon: "⭐", label: "Чанартай хоол" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 text-xs text-[#7A5C3A]"
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ===== БАРУУН ТАЛ ===== */}
      <div className="w-1/2 relative overflow-hidden bg-[#3D2B1A]">
        <img
          src="hool.png"
          alt="Монгол хоол"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1A]/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <span className="inline-flex items-center gap-1.5 bg-[#8B5E34]/80 text-[#F5EFE6] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            🔥 Шинэ захиалга
          </span>
          <h2 className="text-2xl font-bold text-white leading-snug mb-2">
            Монгол үндэсний
            <br />
            хоолны амтыг мэдэр
          </h2>
          <p className="text-sm text-white/70 mb-4">
            ₮30,000-с дээш захиалгад үнэгүй хүргэлт.
          </p>
          <div className="flex flex-wrap gap-2">
            {["🥟 Бууз ₮12,000", "🍖 Хорхог ₮18,000", "🍜 Цуйван ₮14,000"].map(
              (dish) => (
                <span
                  key={dish}
                  className="bg-white/15 border border-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {dish}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
