import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression'; // 使用gzip或brotli压缩资源，可以让项目在构建时直接生成压缩文件。

import styleImport from 'vite-plugin-style-import';
import html from 'vite-plugin-html';

export default defineConfig(({ command, mode }) => {
  // 获取环境变量
  const envParams = loadEnv(mode, './');
  const { VITE_BUILDENV, VITE_ISWEIXIN } = envParams;
  // 不同环境 设置不同的输入目录
  const outDir = VITE_BUILDENV === 'prod' ? 'dist' : VITE_BUILDENV;
  // 指定环境加载vconsole
  const injectData = {
    title: envParams.VITE_SYSTEM_NAME,
    vconsoleScript: '',
    jweixinScript: ''
  };
  if (VITE_BUILDENV === 'debug' || VITE_BUILDENV === 'dev' || VITE_BUILDENV === 'test') {
    // 生产环境不加载vconsole
    injectData.vconsoleScript = '<script src="https://unpkg.com/vconsole@3.9.5/dist/vconsole.min.js"></script>';
  }
  if (VITE_ISWEIXIN === 'true') {
    // 是否在微信中
    injectData.jweixinScript = '<script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>';
  }
  let config = {
    plugins: [
      vue(),
      // inject:将数据注入ejs模板  minify:压缩index.html代码
      html({ inject: { injectData }, minify: true }),
      // 样式按需加载
      styleImport({
        libs: [
          {
            libraryName: 'vant',
            esModule: true,
            resolveStyle: name => `vant/es/${name}/style/index`
          }
        ]
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    base: './',
    clearScreen: false,
    build: {
      assetsDir: 'assets',
      outDir: outDir
    },
    server: {
      port: 4396, // 指定服务端口号
      host: '0.0.0.0', // 指定服务器主机名
      open: true, // 运行自动打开浏览器
      strictPort: true // 若端口被占用退出进程
    }
  };

  command !== 'serve' && config.plugins.push(viteCompression());
  return config;
});
