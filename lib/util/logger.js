/**
 * 日志模块
 * @author   june_01 (hzxiejin@corp.netease.com)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const _ = require('./util');

const defObj = {
  datePattern: '.yyyy-MM-dd.log',
  json: false,
  timestamp: false
};

winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

class Logger {
  constructor(dir) {
    try {
      fs.accessSync(dir);
    } catch(err) {
      fs.mkdirSync(dir);
    }

    // 默认写error和warn级别日志
    this.logger = new (winston.Logger)({
      transports: [
        new winston.transports.DailyRotateFile(Object.assign({
          name: 'warn-log',
          filename: path.join(dir, './warn'),
          level: 'warn'
        }, defObj)),
        new winston.transports.DailyRotateFile(Object.assign({
          name: 'error-log',
          filename: path.join(dir, './error'),
          level: 'error'
        }, defObj))
      ],
      exitOnError: false
    });

    // 测试环境使用debug级别的日志
    if(!process.isOnline) {
      this.logger.add(winston.transports.DailyRotateFile, Object.assign({
        name: 'debug-log',
        filename: path.join(dir, './debug'),
        level: 'debug'
      }, defObj));
    }
  }
  warn(err) {
    let time = _.format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSS');
    if(typeof err === 'string') {
      this.logger.warn(`[${time}] - ${err}`);
    } else {
      this.logger.error(err.stack);
    }
  }
  error(err) {
    let time = _.format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSS');
    if(typeof err === 'string' || err.isNError) {
      // 逻辑异常
      this.logger.error(`[${time}] - 后端逻辑错误`);
    } else {
      // 系统异常
      this.logger.error(`[${time}] - 后端系统错误`)
    }
    this.logger.error(err.stack);
  }
  debug(content, data) {
    let time = _.format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSS');
    this.logger.error(`[${time}] - ${content}`);
  }
};

module.exports = Logger;
