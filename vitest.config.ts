import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // server-only パッケージはサーバー側で no-op になるべき。
      // 通常は `react-server` 条件が解決を empty.js に振り分けるが、
      // Vitest の Node CJS 解決パスでは適用されないことがあるため、
      // テスト環境では明示的に empty.js にエイリアスする。
      "server-only": path.resolve(
        __dirname,
        "./node_modules/server-only/empty.js",
      ),
    },
    conditions: ["react-server"],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    server: {
      deps: {
        inline: ["lunar-typescript", "iztro"],
      },
    },
    reporters: ["default"],
  },
});
