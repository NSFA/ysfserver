'use strict';
const path = require('path');
const Base = require('./base');
const fs = require('fs');
const mkTemplate = require('./template');

let cwd = process.cwd();

class Folder extends Base{
	constructor(config){
		super(config)
	}
	init(config){
		this.createApiFiles(config.apiRoute);
		//this.createVeiwFiles(config.viewRoute, config.engine)
	}

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

	createVeiwFiles(viewRoute, suffix){
		let keys = Object.keys(apiRoute);


		try{
			fs.mkdirSync('./views');
		}catch(err){
			keys.forEach(function(key){
				let view = viewRoute[key] + '.'+ suffix;
				fs.writeFile(path.join('./views', view), mkTemplate())
			});

		}
	}
}

module.exports = function(config){
	new Folder(Object.assign({}, config));
}