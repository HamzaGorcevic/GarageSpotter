import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/assets/scss/_variables.scss";`,
            },
        },
    },
});
