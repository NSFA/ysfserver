'use strict';
/**
 * base 程序基类
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-20  下午11:49
 */
const EventEmitter =  require('events');
class Base extends EventEmitter {
	constructor(config){
		super();
		this.config(config);
		this.init(config);
	}
	config(config){}
	init(config){}
}


module.exports = Base;