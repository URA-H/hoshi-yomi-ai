import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 親ディレクトリ /Users/haruya/Desktop/company に旧 package.json と pnpm-lock.yaml
  // が残っており、Turbopack がワークスペース root を誤推測する警告が出る。
  // 本プロジェクトは fortune-app/ 単独で完結するため、root を明示固定する。
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
