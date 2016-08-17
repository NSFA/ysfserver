'use strict';
/**
 * server Koa 服务器配置
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-01  下午9:55
 */
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const koa = require('koa');
const router = require('router');
const bodyParser = require('koa-body');
const ejsRender = require('koa-ejs');
const profile = require('./profile');


class Server extends EventEmitter{
	constructor(config){
		super();
		this.config();
		this.init();
	}

	config(){
		this.config  = config;
		this.app = koa();
	}
	init(){
		// 解析数据参数
		profile(this.config);
	}
	viewEgine(){
		ejsRender(this.app, {
			root: path.join(this.config.webRoot, this.config.viewRoot || './views'),
			layout: false,
			viewExt: 'ejs',
			cache: true,
			debug: false
		})
	}
	listen(){

	}
}


module.exports = Server;