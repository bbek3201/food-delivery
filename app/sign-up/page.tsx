"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) router.push("/");
    else alert(data.message);
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
        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-gray-500 mb-8">
          Sign up to explore your favorite dishes.
        </p>

        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-4 py-3 mb-4 w-full outline-none"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg px-4 py-3 mb-6 w-full outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gray-300 text-white py-3 rounded-lg font-semibold w-full hover:bg-[#E74C3C] transition-colors"
        >
          {loading ? "Loading..." : "Let's Go"}
        </button>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-500 font-medium">
            Log in
          </a>
        </p>
      </div>

      <div className="w-1/2 h-full">
        <img
          src="food-delivery.png"
          alt="delivery"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
