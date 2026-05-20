/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
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
      router.push("/"); // бүртгэлтэй → нүүр хуудас
    } else {
      setError(data.error); // бүртгэлгүй → алдаа харуулна
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center px-16">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 border rounded mb-10 text-gray-500"
        >
          ‹
        </button>
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8">Sign in to your account.</p>

        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-4 py-3 mb-4 w-full outline-none"
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-3 w-full outline-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="flex items-center gap-2 text-sm text-gray-500 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4"
          />
          Show password
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gray-300 text-white py-3 rounded-lg font-semibold w-full hover:bg-[#E74C3C] transition-colors"
        >
          {loading ? "Loading..." : "Let's Go"}
        </button>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <a href="/sign-up" className="text-blue-500 font-medium">
            Sign up
          </a>
        </p>
      </div>

      <div className="w-1/2 h-full">
        <img
          src="/food-delivery.png"
          alt="delivery"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
