'use strict';
/**
 * template 模板文件
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-21  上午9:29
 */
module.exports = function(name){
	name = name || '测试首页模板';
	let tpl = `<html>
		<head>
			<meta charset="utf-8">
			<title>${port}</title>
		</head>
		<body>
			<h1>
				服务器测试
			</h1>
		</body>
		</html>`

	return tpl;
};