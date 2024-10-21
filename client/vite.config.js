/* 
//vite config for npm run dev
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
});
 */


//vite config for building the project
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Create a separate chunk for large dependencies
          react: ['react', 'react-dom'],
          ethers: ['ethers'],
        },
      },
    },
    chunkSizeWarningLimit: 1700,  // Increase the warning limit to 1 MB if necessary
    target: 'esnext',  // Ensure modern but stable JavaScript output
  },
});

 