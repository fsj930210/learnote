/**
 * 统一返回参数
 */
function getMessage(type, message, status = 200, data = null) {
	return {
		type,
		message,
		status,
		data,
	};
}
/**
 * 解析url参数
 * @param {Object} url
 * @param {Object} queryName
 */
function getParams(url, queryName) {
	const query = decodeURIComponent(url.split('?')[1]);
	const vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (pair[0] === queryName) {
			return pair[1];
		}
	}
	return null;
}

module.exports = {
	getMessage,
	getParams,
};
