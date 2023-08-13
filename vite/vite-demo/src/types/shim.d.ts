import { AttributifyAttributes } from 'windicss/types/jsx';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}

declare module 'virtual:*' {
  export default any;
}
