import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/symphony-of-images/",
  
  plugins: [
    react(),
    tailwindcss(),
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
  ],
})
