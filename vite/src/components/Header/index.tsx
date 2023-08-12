// import { useEffect } from 'react';
import styles from './index.module.scss';
import { devDependencies } from '../../../package.json';
// 1. 导入图片
import logoSrc from '@assets/images/vite.png';
// 组件方式引入
import { ReactComponent as ReactLogo } from '@assets/icons/logo.svg';
// import json from '../../../package.json';

// const { devDependencies } = json;
import Worker from './webworker.ts?worker';

import init from './fib.wasm?init';
import SvgIcon from '../SvgIcon';

// import Logo1 from '@assets/icons/logo-1.svg';
// import Logo2 from '@assets/icons/logo-2.svg';
// import Logo3 from '@assets/icons/logo-3.svg';
// import Logo4 from '@assets/icons/logo-4.svg';
// import Logo5 from '@assets/icons/logo-5.svg';

// const icons = import.meta.glob('../../assets/icons/logo-*.svg');
const icons = import.meta.glob('../../assets/icons/logo-*.svg', { eager: true });

const iconUrls = Object.values(icons).map((mod: any) => {
  // return mod.default
  // 如 ../../assets/icons/logo-1.svg -> logo-1
  const fileName = mod.default.split('/').pop();
  const [svgName] = fileName.split('.');
  return svgName;
});

// 1. 初始化 Worker 实例
const worker = new Worker();
// 2. 主线程监听 worker 的信息
worker.addEventListener('message', (e) => {
  console.log(e);
});

type FibFunc = (num: number) => number;

init({}).then((instance) => {
  const fibFunc = instance.exports.fib as FibFunc;
  console.log('Fib result:', fibFunc(10));
});

const Header = () => {
  // useEffect(() => {
  //   const img = document.getElementById('logo') as HTMLImageElement;
  //   img.src = logoSrc;
  // }, []);
  return (
    <div className={styles.header}>
      this is a header
      <div className="p-20px text-center">
        <h1 className="font-bold text-2xl mb-2">vite version: {devDependencies.vite}</h1>
      </div>
      <div className="flex-c">99999</div>
      {/* 使用图片 */}
      <img id="logo" className="m-auto mb-4" src={logoSrc} alt="" />
      <ReactLogo />
      <img src={new URL('./logo.png', import.meta.env.VITE_IMG_BASE_URL).href} />
      {/* {iconUrls.map((item) => (
        <img src={item} key={item} width="50" alt="" />
      ))} */}
      {iconUrls.map((item) => (
        <SvgIcon name={item} key={item} width="100" height="100" prefix="icon" color="#4c4c4c" />
      ))}
    </div>
  );
};

export default Header;
