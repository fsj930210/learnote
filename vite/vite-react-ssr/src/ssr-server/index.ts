import express, { RequestHandler, Express } from 'express';
import { ViteDevServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';
import fs from 'fs';
import path from 'path';
import serve from 'serve-static';
import { loadSsrEntryModule, isProd, resolveTemplatePath, matchPageUrl, cwd } from './utils';
import { performance, PerformanceObserver } from 'perf_hooks';

// 工程化考虑: 路由、状态管理、缓存、 CSR 降级、CSS in JS、按需加载、浏览器 API、自定义 Header

const perfObserver = new PerformanceObserver((items) => {
	items.getEntries().forEach((entry) => {
		console.log('[performance]', entry.name, entry.duration.toFixed(2), 'ms');
	});
	performance.clearMarks();
});

perfObserver.observe({ entryTypes: ['measure'] });

async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
	let vite: ViteDevServer | null = null;
	if (!isProd) {
		vite = await (
			await import('vite')
		).createServer({
			root: process.cwd(),
			server: {
				middlewareMode: 'ssr',
				watch: {
					usePolling: true,
					interval: 100,
				},
			},
		});
		// 注册 Vite Middlewares
		// 主要用来处理客户端资源
		app.use(vite.middlewares);
	}
	return async (req, res, next) => {
		try {
			if (req.query?.csr) {
				console.log(111);
				// 响应 CSR 模板内容
				// return res.sendFile(resolveTemplatePath());
			}
			// SSR 的逻辑
			const url = req.originalUrl;
			if (!matchPageUrl(url)) {
				// 走静态资源的处理
				return await next();
			}
			// 1. 加载服务端入口模块
			const { ServerEntry, fetchData } = await loadSsrEntryModule(vite);
			// 2. 数据预取
			const data = await fetchData();
			// 3. 「核心」渲染组件
			performance.mark('render-start');
			const appHtml = renderToString(React.createElement(ServerEntry, { data }));
			performance.mark('render-end');
			performance.measure('renderToString', 'render-start', 'render-end');
			// console.log('renderToString 执行时间: ', renderTime.duration.toFixed(2), 'ms');
			// 4. 拼接 HTML，返回响应
			const templatePath = resolveTemplatePath();
			let template = await fs.readFileSync(templatePath, 'utf-8');
			// 开发模式下需要注入 HMR、环境变量相关的代码，因此需要调用 vite.transformIndexHtml
			if (!isProd && vite) {
				template = await vite.transformIndexHtml(url, template);
			}
			const html = template
				.replace('<!-- SSR_APP -->', appHtml)
				// 注入数据标签，用于客户端 hydrate
				.replace('<!-- SSR_DATA -->', `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`);
			res.status(200).setHeader('Content-Type', 'text/html').end(html);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			vite?.ssrFixStacktrace(e);
			console.error(e);
			// res.status(500).end(e.message);
			// 在这里返回浏览器 CSR 模板内容
			res.sendFile(resolveTemplatePath());
		}
	};
}

async function createServer() {
	const app = express();
	// 加入 Vite SSR 中间件
	app.use(await createSsrMiddleware(app));
	// 注册中间件，生产环境端处理客户端资源
	if (isProd) {
		app.use(serve(path.join(cwd, 'dist/client')));
	}
	app.listen(3000, () => {
		console.log('Node 服务器已启动~');
		console.log('http://localhost:3000');
	});
}

createServer();
