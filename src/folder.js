'use strict';
/**
 * folder 文件处理类
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-20  下午11:49
 */
const path = require('path');
const Base = require('./base');
const fs = require('fs');
const mkTemplate = require('./template');

let cwd = process.cwd();

class Folder extends Base{
	constructor(config){
		super(config);

	}
	init(config){
		this.config = config;
		this.createApiFiles(config.apiRoute);
		this.createVeiwFiles(config.viewRoute, config.engine)
	}

	/**
	 * 创建Api目录文件夹
	 *
	 * @param {Object} apiRoute 		- Api路由数组
	 */
	createApiFiles(apiRoute){
		let keys = Object.keys(apiRoute),
			fullApiRoute = Object.assign({}, apiRoute);

		// mkdir mock folder
		if(!fs.existsSync(path.join(cwd, './mock'))) fs.mkdirSync(path.join(cwd, './mock'));

		// mkdir sub folder
		keys.forEach(function(key){
			fullApiRoute[key] = apiRoute[key].map(function(route){
				let dir = path.join(cwd, './mock', key);
				if(!fs.existsSync(dir)) fs.mkdirSync(dir);
				return path.join(cwd, './mock', key, route);
			})
		});

		keys.forEach(function(key){
			this.autoParseDir(apiRoute[key], key);
		}.bind(this))

	}

	/**
	 * 自动解析地址, 按层级结构创建文件夹
	 *
	 * @param {Object} routes			- 路由配置
	 * @param {String} method			- api方法
	 */
	autoParseDir(routes, method){
		let dir = path.join(cwd, './mock', method),
			folderTree = [];

		routes.forEach(function(route){
			let _pathArr = route.split('/').slice(1,-1);
			_pathArr.forEach(function(_path, index){
				folderTree.push(path.join(dir, _pathArr.slice(0, index+1).join('/')))
			})
		});

		folderTree.sort(function(a,b){
			return a.split('/').length > b.split('/').length;
		});

		try{
			folderTree.forEach(function(folder){
				if(!fs.existsSync(folder)) fs.mkdirSync(folder);
			})
		}catch(err){
			// ignore
		}

	}

	/**
	 * 创建模板文件
	 * 
	 * @param {Object} viewRoute			- 模板路由
	 * @param {String} suffix				- 后缀名称
	 */
	createVeiwFiles(viewRoute, suffix){
		let keys = Object.keys(viewRoute);
		if(!fs.existsSync(path.join(cwd, './views'))) fs.mkdirSync(path.join(cwd, './views'));

		keys.forEach(function(key){
			let view = viewRoute[key] + '.'+ suffix,
				dir = path.join(cwd, './views', view);
			if(!fs.existsSync(dir)) fs.writeFileSync(dir, mkTemplate(this.config.name));
		}.bind(this));
	}
}

module.exports = function(config){
	new Folder(Object.assign({}, config));
};