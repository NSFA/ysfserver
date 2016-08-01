'use strict';
/**
 * 包装koa服务器
 * @author: june_01
 */
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const koa = require('koa');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const bodyParser = require('koa-body');
const staticDir = require('koa-static');
const render = require('koa-ejs');
const wrapRouter = require('./router');
const Logger = require('./util/logger');

class Server extends EventEmitter {
  constructor(config) {
    super();

    this.config = config;
    this.app = koa();

    this.init();
    this.listen();
  }
  /**
   * 初始化
   */
  init() {
    // view egine
    render(this.app, {
      root: path.join(this.config.webRoot, this.config.viewRoot || './views'),
      layout: false,
      viewExt: 'ejs',
      cache: true,
      debug: false
    });

    // logger
    this.logger = new Logger(path.join(this.config.serverRoot, this.config.loggerRoot || '/log'));

    // static dir
    this.app.use(staticDir(path.join(this.config.webRoot, this.config.staticRoot || './public')));

    // bodyParser
    let bodyOpt = {
      strict: false
    };
    if(this.config.uploadRoot) {
      // 存在文件上传的情况
      let uploadDir = path.join(this.config.serverRoot, this.config.uploadRoot);
      try {
        fs.accessSync(uploadDir);
      } catch(ex) {
        fs.mkdirSync(uploadDir);
      }

      bodyOpt = Object.assign({
        multipart: true,
        formidable:{uploadDir}
      }, bodyOpt);
    }
    this.app.use(bodyParser(bodyOpt));

    // session
    this.app.keys = ['THIS IS A SECRECT'];
    this.app.use(session({
      store: redisStore({
        host: '127.0.0.1',
        port: '6379'
      })
    }));

    // xhr or view error
    let errFunc = this.config.onerror
    if(errFunc && typeof errFunc && errFunc.constructor.name === 'GeneratorFunction') {
      this.app.use(function*(next) {
        try {
          yield next;
        } catch(err) {
          yield *errFunc.call(this, err);
        }
      });
    }

    // filter & controller
    if(this.config.controller) {
      let controller = this.config.controller;
      // 视图
      if(controller.web) this.config.controllerWeb = controller.web;
      // 异步接口
      if(controller.api) this.config.controllerApi = controller.api;
    }
    let rArr = ['filter', 'controllerApi', 'controllerWeb'];
    for(let item of rArr) {
      let dirpath = this.config[item];
      let routes = [];
      if(dirpath) {
        let stat = fs.statSync(dirpath);
        if(!stat.isDirectory()) return;

        let subs = fs.readdirSync(dirpath);
        for(let file of subs) {
          let filePath = path.join(dirpath, file);
          if(fs.statSync(filePath).isFile() && path.extname(filePath) === '.js') {
            routes.push(require(filePath));
          }
        }

        for(let route of routes) {
          if(typeof route === 'object') {
            route = wrapRouter(route);
            this.app.use(route.routes())
                    .use(route.allowedMethods());
          }
        }
      }
    }

    // error handle
    this.app.on('error', (err, ctx) => this.emit('error', err, ctx));
  }
  /**
   * 监听
   */
  listen() {
    let port = this.config.port || '8000';
    this.app.listen(port);
    console.log(`listening on port: ${port}`);
  }
}

module.exports = Server;
