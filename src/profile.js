'use strict';
/**
 * profile 配置文件预处理
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-03  下午2:22
 */

const EventEmitter = require('events');
const fs = require('fs');
const _ = require('./util/util');
const lg = require('./util/logger');
const codeMap = require('./util/codeMap');

class Profile extends EventEmitter {
	constructor (pwd){
		super();
		this.pwd = pwd;
	}

	init(){
		let config = require(this.pwd);
		if(!_.isObject(config)) lg.logger(codeMap[8001])

		return config;
	}
}


module.exports = Profile;