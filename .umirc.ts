import { defineConfig } from 'umi';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import routes from './routes';

export default defineConfig({
  routes,
  npmClient: 'pnpm',
  plugins: ['@umijs/plugins/dist/request', '@umijs/plugins/dist/locale'],
  request: {
    dataField: '',
  },
  locale: {
    // 默认使用 src/locales/en-US.ts 作为多语言文件
    default: 'en-US',
    baseSeparator: '-',
  },
  esbuildMinifyIIFE: true,
  chainWebpack: (config) => {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin);
    // 静态资源的文件限制调整为 1GB，避免视频等大文件资源阻塞项目启动
    config.performance.maxAssetSize(1000000000);
    return config;
  },
});
