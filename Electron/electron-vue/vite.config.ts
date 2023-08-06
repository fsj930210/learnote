import { defineConfig } from 'vite';
import { join } from 'path';
import vue from '@vitejs/plugin-vue';
import optimizer from 'vite-plugin-optimizer';
import { devPlugin, getReplacer } from './plugins/devPlugin';
import { buildPlugin} from './plugins/buildPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@renderer': join(__dirname, './src/renderer'),
    },
  },
  plugins: [ 
    optimizer(getReplacer()),
    devPlugin(),
    vue(),
    buildPlugin(),
  ],
})
