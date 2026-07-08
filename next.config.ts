import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  /* Aquí puedes mantener o agregar otras configuraciones como reactStrictMode si lo requieres */
};

export default nextConfig;