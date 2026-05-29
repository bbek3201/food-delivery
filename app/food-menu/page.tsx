// app/food-menu/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FoodMenuRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return null;
}
