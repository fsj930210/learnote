// import { render } from "https://cdn.skypack.dev/react-dom";
// import { render } from "react-dom";
// import React from "react";

// react-dom 的内容全部从 CDN 拉取
// 这段代码目前是无法运行的
import { render } from "https://cdn.skypack.dev/react-dom";
import React from 'https://cdn.skypack.dev/react'

// 应用了 env 插件后，构建时将会被替换成 process.env 对象
import { PATH } from 'env'

import './index.css';

console.log(`PATH is ${PATH}`)


let Greet = () => <h1 className="hello">Hello, juejin!</h1>;

render(<Greet />, document.getElementById("root"));
