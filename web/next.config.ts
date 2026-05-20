import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // 🔑 THE CRITICAL FIX: Direct the proxy to your actual Kubernetes service name!
        destination: 'http://adoptimizer-backend:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
