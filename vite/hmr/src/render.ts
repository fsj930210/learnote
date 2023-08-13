import './style.css';

export const render = () => {
	const app = document.querySelector<HTMLDivElement>('#app')!;
	app.innerHTML = `
    <h1>Hello Vite!</h1>
    <p target="_blank">This is hmr test.123ddeeeed弟弟快快打开得到的点点滴滴</p>
  `;
};

// 条件守卫
// if (import.meta.hot) {
// 	import.meta.hot.accept((mod) => mod.render());
// }
