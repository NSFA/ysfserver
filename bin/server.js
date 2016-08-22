#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const package = require('../package.json');

program
.version(package.version)
.description('七鱼代理服务器程序')
.option('-i, --init [value]', '初始化目录')
.option('-c, --config [value]', '加载配置文件')
.parse(process.argv);


// start config param
if(program.init){
	var _config = require(path.join(process.cwd(), program.init));
	require('../src/folder')(_config);
}else if(program.config){
	require('../src/server')(program.config);
}else{
	console.log("请指定正确的参数");
}