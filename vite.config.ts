import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - rarely change, cached longer
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-toast'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
          // Dashboard chunks - loaded on demand
          'dashboard-athlete': [
            './src/pages/athlete/AthleteOverview',
            './src/pages/athlete/AthleteProfile',
            './src/pages/athlete/AthleteEvents',
          ],
          'dashboard-organizer': [
            './src/pages/organizer/OrganizerOverview',
            './src/pages/organizer/OrganizerEvents',
            './src/pages/organizer/OrganizerParticipants',
          ],
          'dashboard-admin': [
            './src/pages/admin/AdminOverview',
            './src/pages/admin/AdminUsers',
            './src/pages/admin/AdminEvents',
          ],
        },
      },
    },
    // Optimize build size
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'date-fns',
      'lucide-react',
    ],
  },
}));
