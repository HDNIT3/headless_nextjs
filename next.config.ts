import type { NextConfig } from "next";

// Lấy base URL của WordPress
const wpBaseUrl =
  process.env.WORDPRESS_URL?.replace(/\/+$/, '') ||
  (process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL)?.replace(/\/graphql\/?$/, '') ||
  "http://localhost/prj";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.70', 'localhost', '127.0.0.1'],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      // Rewrite URI /san-pham/wp-upload/... trên FE về /wp-content/uploads/... của WordPress backend
      {
        source: "/san-pham/wp-upload/:path*",
        destination: `${wpBaseUrl}/wp-content/uploads/:path*`,
      },
      // Giữ cả /wp-upload và /wp-content dự phòng
      {
        source: "/wp-upload/:path*",
        destination: `${wpBaseUrl}/wp-content/uploads/:path*`,
      },
      {
        source: "/wp-content/:path*",
        destination: `${wpBaseUrl}/wp-content/:path*`,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
