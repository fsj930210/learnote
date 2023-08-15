import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';
// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
import path from 'path';

import autoprefixer from 'autoprefixer';

import windi from 'vite-plugin-windicss';

import viteEslint from 'vite-plugin-eslint';

import viteStylelint from 'vite-plugin-stylelint';

// svg以组件形式导入
// import svgr from 'vite-plugin-vue2-svg'; vue2引入这个插件
// import svgr from 'vite-svg-loader'; vue3引入这个插件
import svgr from 'vite-plugin-svgr'; // react引入这个插件;
// 图片压缩
import viteImagemin from 'vite-plugin-imagemin';
// 雪碧图
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import { esbuildPatchPlugin } from './build/esbuildPatchPlugin';
import { virtualModulePlugin } from './build/virtualModulePlugin';

import inspect from 'vite-plugin-inspect';

// import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// import { viteSvgrPlugin } from './build/svgrPlugin';
// https://vitejs.dev/config/

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/styles/variable.scss'));

// 是否为生产环境，在生产环境一般会注入 NODE_ENV 这个环境变量，见下面的环境变量文件配置
// const isProduction = process.env.NODE_ENV === 'production';

// 填入项目的 CDN 域名地址
// const CDN_URL = 'http://www.abc.com';

export default defineConfig({
  // base: isProduction ? CDN_URL : '/',
  // 手动指定项目根目录位置
  // root: path.join(__dirname, 'src'),
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@assets': path.join(__dirname, 'src/assets')
    }
  },
  plugins: [
    react({
      babel: {
        // 加入 babel 插件
        // 以下插件包都需要提前安装
        // 当然，通过这个配置你也可以添加其它的 Babel 插件
        plugins: [
          // 适配 styled-component
          'babel-plugin-styled-components',
          // 适配 emotion
          '@emotion/babel-plugin'
        ]
      },
      // 注意: 对于 emotion，需要单独加上这个配置
      // 通过 `@emotion/react` 包编译 emotion 中的特殊 jsx 语法
      jsxImportSource: '@emotion/react'
    }),
    windi(),
    viteEslint(),
    viteStylelint({
      // 对某些文件排除检查
      exclude: ['windicss', 'node_modules']
    }),
    // viteSvgrPlugin({ defaultExport: 'url' }),
    svgr({ include: 'src/**/*.svg' }),
    viteImagemin({
      // 无损压缩配置，无损压缩下图片质量不会变差
      optipng: {
        optimizationLevel: 7
      },
      // 有损压缩配置，有损压缩下图片质量可能会变差
      pngquant: {
        quality: [0.8, 0.9]
      },
      // svg 优化
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/icons')]
    }),
    virtualModulePlugin(),
    // chunkSplitPlugin(),
    inspect()
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        })
      ]
    },
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    }
  },
  // json: {
  //   stringify: true
  // },
  assetsInclude: ['.mp4'],
  build: {
    assetsInlineLimit: 4 * 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库打包成单独的 chunk 中
          'react-vendor': ['react', 'react-dom'],
          // 将 Lodash 库的代码单独打包
          lodash: ['lodash-es'],
          // 将组件库的代码打包
          library: ['antd', '@arco-design/web-react']
        }
        // manualChunks(id) {
        //   if (id.includes('antd') || id.includes('@arco-design/web-react')) {
        //     return 'library';
        //   }
        //   if (id.includes('lodash')) {
        //     return 'lodash';
        //   }
        //   if (id.includes('react')) {
        //     return 'react';
        //   }
        // }
      }
    }
  },
  // 预构建相关的配置
  optimizeDeps: {
    // 自定义预构建的入口文件
    // entries: []
    // 强制预构建 配置为一个字符串数组，将 `lodash-es` 和 `vue`两个包强制进行预构建
    // 针对一些动态 import
    include: [
      'react-virtualized',
      'lodash-es',
      // 按需加载的依赖都可以声明到这个数组里
      'object-assign',
      // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
      '@loadable/component > hoist-non-react-statics'
    ],
    exclude: ['@loadable/component'],
    esbuildOptions: {
      plugins: [
        // 加入 Esbuild 插件
        esbuildPatchPlugin
      ]
    }
  }
});
