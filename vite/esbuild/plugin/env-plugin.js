module.exports = () => {
	return {
		name: 'env',
		setup(build) {
			build.onResolve({ filter: /^env$/ }, (args) => {
				// console.log(args);
				return {
					path: args.path,
					namespace: 'env-ns',
				};
			});

			build.onLoad({ filter: /.*/, namespace: 'env-ns' }, (args) => {
				// console.log(args);
				return {
					contents: JSON.stringify(process.env),
					loader: 'json',
				};
			});
		},
	};
};
