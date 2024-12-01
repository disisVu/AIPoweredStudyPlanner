import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 3000
  },
  plugins: [react(), tsconfigPaths(), svgr()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  }
})
