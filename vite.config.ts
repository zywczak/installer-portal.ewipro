import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/widget-main.tsx",
      name: "FormWidget",
      fileName: "form-widget",
      formats: ["es"],
    },
    rollupOptions: {
      external: [],
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
