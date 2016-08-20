'use strict';
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