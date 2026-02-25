import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/:path*",
        destination: "/api/markdown/:path*",
        has: [
          {
            type: "header",
            key: "accept",
            value: "(.*text/markdown.*|.*text/plain.*)",
          },
        ],
      },
    ],
  }),
};

export default nextConfig;
