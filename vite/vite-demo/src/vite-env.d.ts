/// <reference types="vite/client" />
// import { AttributifyAttributes } from 'windicss/types/jsx';
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 自定义的环境变量
  readonly VITE_IMG_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// declare module 'react' {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   interface HTMLAttributes<T> extends AttributifyAttributes {}
// }

declare module 'virtual:*' {
  export default any;
}
