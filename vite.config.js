import react from "@vitejs/plugin-react";

import {
  defineConfig,
  loadEnv,
} from "vite";

export default defineConfig(
  ({ mode }) => {
    const env = loadEnv(
      mode,
      process.cwd(),
      "",
    );

    return {
      /*
      |--------------------------------------------------------------------------
      | React
      |--------------------------------------------------------------------------
      */

      plugins: [
        react(),
      ],

      /*
      |--------------------------------------------------------------------------
      | BASE PATH
      |--------------------------------------------------------------------------
      |
      | Important for Vercel deployment.
      |--------------------------------------------------------------------------
      */

      base: "/",

      /*
      |--------------------------------------------------------------------------
      | CSS MODULES
      |--------------------------------------------------------------------------
      */

      css: {
        modules: {
          localsConvention:
            "camelCaseOnly",
        },
      },

      /*
      |--------------------------------------------------------------------------
      | LOCAL DEVELOPMENT SERVER
      |--------------------------------------------------------------------------
      */

      server: {
        proxy: {
          "/api/hackathon": { target: "http://127.0.0.1:5051", changeOrigin: false },
          "/api": {
            target:
              env.DEV_API_PROXY_TARGET ||
              "http://127.0.0.1:5050",

            changeOrigin: true,

            secure: false,
          },
        },
      },

      /*
      |--------------------------------------------------------------------------
      | VITE PREVIEW
      |--------------------------------------------------------------------------
      */

      preview: {
        proxy: {
          "/api/hackathon": { target: "http://127.0.0.1:5051", changeOrigin: false },
          "/api": {
            target:
              env.DEV_API_PROXY_TARGET ||
              "http://127.0.0.1:5050",

            changeOrigin: true,

            secure: false,
          },
        },
      },

      /*
      |--------------------------------------------------------------------------
      | PRODUCTION BUILD
      |--------------------------------------------------------------------------
      */

      build: {
        sourcemap: false,

        assetsDir: "assets",

        rollupOptions: {
          output: {
            /*
             * Keep generated asset names predictable.
             */
            entryFileNames:
              "assets/[name]-[hash].js",

            chunkFileNames:
              "assets/[name]-[hash].js",

            assetFileNames:
              "assets/[name]-[hash][extname]",
          },
        },
      },
    };
  },
);
