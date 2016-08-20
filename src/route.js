'use strict';
/**
 * route中间件
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-17  下午10:58
 */
const Router = require('koa-router');
const Base = require('./base');
const path = require('path');
const fs = require('fs');

class ParseRouter extends Base {
	constructor(route){
		super(route);
		this.router = Router();
		this.parseRouter(route);
	}
	parseRouter(route, that){
		let apiRoute = route.apiRoute,
			viewRoute = route.viewRoute,
			methods = Object.keys(apiRoute),
			paths = Object.keys(viewRoute);

		// 解析api接口路由
		for(let method of methods){
			let its = apiRoute[method];
			for(let it of its){
				this.router[method](it, this.apiRoute(method, it))
			}
		}

		// 解析模板路由
		for(let path of paths){
			let template = viewRoute[path];
			this.router['get'](path, this.viewRoute(template));
		}

	}

	/**
	 * 视图模板配置处理
	 *
	 * @param {String} template 		- 模板
	 * @param {String} path				- 请求地址
	 * @returns {viewRoute}
	 */
	viewRoute(template){
		return function *viewRoute(next){
			yield this.render(template);
		}
	}

	/**
	 * API路由配置处理
	 *
	 * @param {String} method	   		- 请求方法
	 * @param {String} path				- 请求地址
	 * @param {String} path				- 请求地址
	 * @returns {viewRoute}
	 */
	apiRoute(method, api){
		api = path.join(process.cwd(), './mock', method, api+'.js');
		return function *viewRoute(next){
			this.type = 'json';
			this.body = fs.readFileSync(path);
		}
	}

	routes(){
		return this.router.routes()
	}
}


module.exports = function(route){
	var parse = new ParseRouter(route);
	return parse.routes();
};