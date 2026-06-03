/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updatePasswordAction } from "@/app/actions";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!token) {
      setStatus("Error: Invalid or missing reset token.");
      return;
    }

    if (password !== confirm) {
      setStatus("Passwords don't match. Try again.");
      return;
    }

    setLoading(true);
    const res = await updatePasswordAction({ token, password });
    setLoading(false);

    if (res?.error) {
      setStatus(`✗ ${res.error}`);
    } else {
      setStatus("✓ Password successfully updated!");
      setTimeout(() => router.push("/sign-in"), 2000);
    }
  }

  return (
    <main className="min-h-dvh flex bg-white">
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={handleReset} className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-[24px] font-semibold text-black">
              Create new password
            </h1>
            <h2 className="text-[16px] text-zinc-500">
              Set a new password for your account.
            </h2>
          </div>

          <div className="space-y-4">
            <input
              type={show ? "text" : "password"}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black outline-none focus:border-zinc-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type={show ? "text" : "password"}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-black outline-none focus:border-zinc-500"
              placeholder="Confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                onChange={(e) => setShow(e.target.checked)}
              />
              Show password
            </label>
            {status && (
              <p
                className={`text-sm ${status.startsWith("✓") ? "text-green-500" : "text-red-500"}`}
              >
                {status}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-zinc-600 px-3 py-2 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create password"}
          </button>
        </form>
      </div>
      <div className="hidden lg:block w-1/2 relative m-6">
        <img
          src="/main.png"
          alt="Delivery"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        />
      </div>
    </main>
  );
}
