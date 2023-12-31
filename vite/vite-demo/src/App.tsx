import { useState, lazy, Suspense } from 'react';
import lodash, { uniq } from 'lodash-es';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Header from './components/Header';
import { Button } from 'antd';
import 'antd/es/button/style';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Notification } from '@arco-design/web-react';

let a = 1;
lodash.debounce(() => {
  a++;
  console.log(a);
  console.log(123);
});

const DynamicComponent = lazy(() => import('./components/Dynamic'));

function App() {
  const [count, setCount] = useState(0);
  const a = uniq([1, 2, 3, 4, 5, 1, 3, 4, 3]);
  console.log(a);
  return (
    <>
      <div>
        <Header></Header>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>

      <button
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
        text="sm white"
        font="mono light"
        p="y-2 x-4"
        border="2 rounded blue-200"
      >
        Button
      </button>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route
              index
              element={
                <Link to="/dynamic">
                  <Button>查看动态 import 的组件</Button>
                  <Notification />
                </Link>
              }
            />
            <Route
              path="dynamic"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DynamicComponent />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
