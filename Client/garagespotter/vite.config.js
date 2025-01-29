import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
    },
    resolve: {
        extensions: [".mjs", ".js", ".ts", ".tsx", ".jsx"],
        alias: {
            "apollo-upload-client": "apollo-upload-client/public/index.js",
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/assets/scss/_variables.scss";`,
            },
        },
    },
    build: {
        // Increase chunk size limit if necessary
        chunkSizeWarningLimit: 1000, // You can adjust this value based on your needs

        // Rollup options for manual chunk splitting
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "vendor"; // Put all node_modules dependencies into a "vendor" chunk
                    }
                },
            },
        },
    },
});
