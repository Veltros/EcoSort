import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  outputFileTracingExcludes: {
    "*": [
      "./app/generated/prisma/**",
      "./node_modules/@prisma/client/**",
      "./node_modules/prisma/**",
    ],
  },
};

export default nextConfig;
