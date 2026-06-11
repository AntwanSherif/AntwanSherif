import { defineConfig } from "vitest/config";
import path from "path";

// Alias server-only → its empty shim so vitest (Node) can import modules that
// use `import "server-only"` without throwing. Next.js does the same substitution
// at build time for server bundles.
export default defineConfig({
  resolve: {
    alias: {
      "server-only": path.resolve(
        "./node_modules/server-only/empty.js"
      ),
    },
  },
  test: {
    environment: "node",
  },
});
