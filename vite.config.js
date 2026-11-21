import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const notFoundDrawing = readFileSync(new URL("./public/drawings/not-found.svg", import.meta.url), "utf8");

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/",
    define: {
        "import.meta.env.NOT_FOUND_DRAWING_READY": !notFoundDrawing.includes('data-placeholder="true"')
    },
});