//import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/* // https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  }
}) */

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        define: {
            'process.env.GPT_API_KEY': JSON.stringify(env.GPT_API_KEY),
            // If you want to exposes all env variables, which is not recommended
            // 'process.env': env
        },
    };
});