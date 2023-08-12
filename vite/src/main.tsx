import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// 用来注入 Windi CSS 所需的样式，一定要加上！
import 'virtual:windi.css';
// svg组件需要
import 'virtual:svg-icons-register';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
