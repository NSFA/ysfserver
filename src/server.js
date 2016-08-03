/**
 * server Koa 服务器配置
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-01  下午9:55
 */
import EventEmitter  from 'events';
import fs from 'fs';
import path from 'path';

import koa from 'koa';
import router from 'router';
import bodyParser from 'koa-body';
import ejsRender from 'koa-ejs';

class Server extends EventEmitter{
	constructor(config){
		super();
		this.config = config;
		this.app = koa();
		this.init();
	}
	init (){

	}
	reset(){

	}
	listen(){

	}
}


export default Server