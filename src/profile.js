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
	constructor (config){
		super();
		this.init(config);
	}

	init(){
		
	}

	parseConfig (){

	}
}


module.exports = Profile;