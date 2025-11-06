import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import * as toolbox from './src/utils/toolbox';
import path from "node:path";

// https://vite.dev/config/
export default () => {
  console.log('* loading env vars...');
  console.log('* NODE_ENV:', process.env.NODE_ENV);

  process.env = {...process.env, ...loadEnv(
    process.env.NODE_ENV ?? 'development',
    process.cwd()
  )};

  // supabase configs
  console.log(`  SUPABASE_URL: ${toolbox.truncate(process.env.VITE_SUPABASE_URL ?? '')}`);
  console.log(`  SUPABASE_KEY: ${toolbox.truncate(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '')}`);

  // base url
  let VITE_BASE_URL = process.env.VITE_BASE_URL ?? './';
  console.log(`  BASE_URL: ${toolbox.truncate(process.env.VITE_BASE_URL ?? '')}`);

  return defineConfig({
    base: VITE_BASE_URL,

    server: {
      host: '0.0.0.0',
      port: 8968,
    },

    define: {
      ENV_CONFIG: process.env,
    },

    plugins: [
      vue(), 
      tailwindcss(),
      Components({
        resolvers: [
          PrimeVueResolver()
        ] 
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    build: {
      outDir: 'dist',
      target: ['es2022', 'chrome89', 'firefox89', 'safari15'],
    },
  })
}
