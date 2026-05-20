import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // 🔑 THE FIX: Route explicitly to your active 'api' service!
        destination: 'http://api:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
