import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Explicitly set the Turbopack root to this project directory to avoid
  // Next.js picking a higher-level lockfile as the workspace root.
  // Provide an absolute path as required by Turbopack.
  turbopack: {
    root: path.resolve("./"),
  },
};

export default nextConfig;
