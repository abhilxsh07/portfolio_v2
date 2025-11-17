import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/portfolio_v2/",   // VERY important: matches your repo & URL
});
