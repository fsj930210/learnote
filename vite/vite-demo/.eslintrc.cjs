module.exports = {
  // env 配置后便会启用浏览器和 Node.js 环境，这两个环境中的一些全局变量(如 window、global 等)会同时启用。
  env: {
    browser: true,
    es2021: true
  },
  globals: {
    // 不可重写
    $: false, // "writable"或者 true，表示变量可重写；"readonly"或者false，表示变量不可重写；"off"，表示禁用该全局变量。
    jQuery: false
  },
  extends: [
    // 从 ESLint 本身继承；
    'eslint:recommended',
    // 从类似 eslint-config-xxx 的 npm 包继承；一般配置的时候可以省略 `eslint-config`
    // 'standard',
    // 从 ESLint 插件继承，可以省略包名中的 `eslint-plugin`
    // 格式一般为: `plugin:${pluginName}/${configName}`
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    // 1. 接入 prettier 的规则
    // eslint-config-prettier用来覆盖 ESLint 本身的规则配置，而eslint-plugin-prettier则是用于让 Prettier 来接管eslint --fix即修复代码的能力
    'prettier',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    'prettier/prettier': 'error',
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react/react-in-jsx-scope': ['off'],
    'react/no-unknown-property': ['off'],
    '@typescript-eslint/no-explicit-any': ['off']
  }
};
