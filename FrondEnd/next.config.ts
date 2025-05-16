import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["png.pngtree.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/supabase-functions/:path*",
        destination:
          "https://edaiyqrxctozonsclcqt.supabase.co/functions/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
