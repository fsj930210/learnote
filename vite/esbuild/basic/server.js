const { context } = require('esbuild');

async function runBuild() {
	const ctx = await context({
		absWorkingDir: process.cwd(),
		entryPoints: ['./src/index.jsx'],
		bundle: true,
		outdir: 'dist',
		format: 'esm',
		splitting: true,
		sourcemap: true,
		ignoreAnnotations: true,
		metafile: true,
	});
	const { host, port } = await ctx.serve({
		port: 8000,
		// 静态资源目录
		servedir: './dist',
	});
	console.log(`HTTP Server starts at port http://${host}:${port}`);
}

runBuild();
