"use client";
import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    const ping = () => fetch("/api/keepalive");
    ping();
    const interval = setInterval(ping, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  return null;
}
