import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Evita warning su lockfile multipli e usa la root del progetto
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
