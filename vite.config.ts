import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore - vite-plugin-seo-prerender 没有类型定义
import seoPrerender from 'vite-plugin-seo-prerender';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build' && mode === 'production';
  
  return {
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
      // 生产环境启用预渲染
      ...(isProduction
        ? [
            seoPrerender({
              routes: [
                '/',
                '/market',
                // 预渲染一些热门详情页示例（根据实际需要调整）
                '/market/510050', // 上证50ETF
                '/market/510300', // 沪深300ETF
                '/market/510500', // 中证500ETF
              ],
            }),
          ]
        : []),
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
      '@pages': path.resolve(__dirname, './src/pages'),
      '@/Layout': path.resolve(__dirname, './src/Layout'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'charts-vendor': ['lightweight-charts'],
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash].[ext]`;
          }
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `media/[name]-[hash].[ext]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/.test(assetInfo.name)) {
            return `images/[name]-[hash].[ext]`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].[ext]`;
          }
          if (ext === 'css') {
            return `css/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
    target: 'es2015',
    assetsInlineLimit: 4096,
  },
  };
});

