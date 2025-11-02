import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        {
          'react': ['StrictMode', 'Suspense', 'Fragment'], // 明确指定 JSX 组件
        },
      ],
      dts: './auto-imports.d.ts', // 自动生成类型声明文件
      eslintrc: {
        enabled: true, // 自动生成 .eslintrc-auto-import.json
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    react(), // react 插件应该在 AutoImport 之后，以便处理已注入的导入
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

