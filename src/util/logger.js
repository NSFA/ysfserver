'use strict';
/**
 * logger 日志文件
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-03  下午3:44
 * @level
 */

const fs = require('fs');
const path = require('path');

const winston = require('winston');
const EventEmitter = require('events');
const _ = require('./util');


// 默认配置
const defObj = {
	json: false,
	timestamp: false
};

/**
 * @class   Logger
 * @extend  EventEmitter
 * @constructor {Object} logger			- 日志实例
 */
class Logger extends EventEmitter {
	constructor (dir){
		super();
		try {
			fs.accessSync(dir);
		}catch(err){
			fs.mkdirSync(dir);
		}

		this._logger = new (winston.Logger)({
			transports: [
				new (winston.transports.Console)(),
				new (winston.transports.File)(Object.assign({
					filename : path.join(dir, './info.log')
				}, defObj))
			]
		});
	}

	/**
	 *	
	 * @param {String} str  			日志
	 * @param {String} type
	 */
	logger (str, type){
		type = 'info' || type;
		let time = _.format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSS');
		this._logger[type](`[${time}]    -  ${str}`);
	}
}

module.exports = new Logger(path.join(process.cwd(), './log'));