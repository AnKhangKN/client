import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.docx", "**/*.pptx", "**/*.xlsx", "**/*.pdf"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // @ trỏ đến thư mục src
    },
  },
});
