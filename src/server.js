'use strict';
/**
 * server Koa 服务器配置
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-01  下午9:55
 */
const Base = require('./base');
const fs = require('fs');
const path = require('path');

const koa = require('koa');
const bodyParser = require('koa-body');
const ejsRender = require('koa-ejs');


class Server extends Base{
	constructor(routes){
		super(routes);
	}
	config(routes){
		this.app = koa();
	}
	init(routes){
		this.viewEgine();
		this.app.use(routes);
		this.app.on('error', this.error.bind(this))
	}
	viewEgine(){
		ejsRender(this.app, {
			root: path.join(process.cwd(), './views'),
			layout: false,
			viewExt: 'ejs',
			cache: true,
			debug: false
		})
	}
	listen(port){
		this.app.listen(port);
		console.log(`listening on port: ${port}`);
	}
	error(err, ctx){
		console.log(err.stack);
	}
}


module.exports = function(cPath){
	let config = require(path.join(process.cwd(), cPath)),
		routes = require('./route')(config);

	new Server(routes).listen(config.port);
};