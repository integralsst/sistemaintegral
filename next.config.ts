import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Agrega este bloque para autorizar las calidades
  images: {
    qualities: [75, 100],
  },
  // Si tienes otras configuraciones aquí (como reactStrictMode), mantenlas.
};

export default nextConfig;