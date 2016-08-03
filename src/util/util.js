
'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');


const co = require('co');

/**
 * 生成md5加密
 */
exports.md5 = function(content) {
  return crypto.createHash('md5').update(content).digest('hex');
};

/**
 * 生成min和max之间的一个随机数
 */
exports.rand = function(min, max) {
  return Math.floor(Math.random() * (max-min) + min);
};


/**
 * sha256加密
 */
exports.sha256 = function(content) {
  return crypto.createHash('md5').update(content).digest('hex');
};

/**
 * 时间格式化
 */
exports.format = function(time, reg) {
  let date = typeof time === 'string' ? new Date(time) : time;
  let map = {};
  map.yyyy = date.getFullYear();
  map.yy = ('' + map.yyyy).substr(2);
  map.M = date.getMonth() + 1
  map.MM = (map.M < 10 ? '0' : '') + map.M;
  map.d = date.getDate();
  map.dd = (map.d < 10 ? '0' : '') + map.d;
  map.H = date.getHours();
  map.HH = (map.H < 10 ? '0' : '') + map.H;
  map.m = date.getMinutes();
  map.mm = (map.m < 10 ? '0' : '') + map.m;
  map.s = date.getSeconds();
  map.ss = (map.s < 10 ? '0' : '') + map.s;
  map.SSS = date.getMilliseconds();

  return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s|SSS\b/g, function($1) {
    return map[$1];
  });
};

/**
 * 生成随机串
 */
exports.randString = (function() {
  let complexChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*()-=_+,./<>?;:[{}]\'"~`|\\';
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let numchars = '0123456789';
  return function(length, onlyNum, isComplex) {
    let strs = isComplex ? complexChars : chars;
    strs = onlyNum ? numchars : strs;
    length = length || 10;
    let ret = [];
    for(let i=0, it; i<length; ++i) {
      it = Math.floor(Math.random() * strs.length);
      ret.push(strs.charAt(it));
    }
    return ret.join('');
  };
})();


/**
 * 针对generator的作用域绑定方法，针对nodejs4.4.5的bug
 */
var bind = exports.bind = function(func, scope) {
  let args = [].concat([].slice.call(arguments, 2));

  return function*() {
    return yield *func.apply(scope, args);
  };
};

/**
 * 对co再封装一层，可绑定this
 */
exports.co = function(func, scope) {
  return co(bind(func, scope));
};

exports.isObject = function(str){
	({}).toString.call(str).slice(8,-1).toLocaleLowerCase() === 'object'
}
