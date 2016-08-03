var path = require('path');


var config = {
	routes: {
		'GET /api/xxx/get': {id: 15278, type: 'api', path: '/get/api/xxx/get'},
		'GET /api/xxx/info/get':  {id: 15277, type: 'api', path: '/get/api/xxx/info/get'},
		'GET /': {index: 0, type: 'tpl', name: '首页XXX', list:[{id: 10947, path: 'index'}]}
	},
	launch: true,
	port: 8001,
	engine: 'ejs'
}
