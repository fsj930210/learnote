// cjs加载esm 只能通过异步方式
async function init() {
	const { default: chalk } = await import('chalk');
	console.log(chalk.green('hello world'));
}

init();
