import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Бүх төрлийн гадны линкнээс зураг уншихыг зөвшөөрөх (Хамгийн амархан)
      },
    ],
  },
};

export default nextConfig;
