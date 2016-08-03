/**
 * util工具包
 * @author: june_01
 */
'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');

const co = require('co');
const redis = require('redis');

const defCodeMap = require('./codemap.json');

/**
 * 生成唯一key
 */
var seed = exports.seed = (function() {
  let time = +new Date();
  let seed = time;
  return function() {
    return ('' + seed++);
  };
})();

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
 * 校验格式
 *
 * 传入数据，data为要校验数据，rules为规则表，其格式如下：
 *
 * {
 *     xxx字段名: {
 *         required: true,
 *         value: /\d{0,3}/
 *     }
 * }
 */
var validate = exports.validate = (function() {
  let rmap = {
    // 判断当前字段是否必须
    required: function(val, rval) {
      return !rval || val !== undefined;
    },
    // 判断值是否符合正则
    value: function(val, rval) {
      if(val === undefined) return true;
      if(!(rval instanceof RegExp)) return false;

      if(val instanceof Array) {
        for(let item of val) {
          if(!rval.test('' + item)) return false;
        }
        return true;
      }

      return rval.test('' + val);
    },
    // 判断值是否是数字
    isNumber: function(val, rval) {
      let flag = !rval || (typeof val === 'number' && !isNaN(val)) || /\d+/.test(val);
      if(flag) {
        return function(val) {
          return parseInt(val, 10);
        };
      } else {
        return flag;
      }
    },
    // 判断值是否是数组
    isArray: function(val, rval) {
      return !rval || val instanceof Array;
    },
    // 判断值是否是布尔值
    isBoolean: function(val, rval) {
      let flag = !rval || typeof val === 'boolean' || /(true|false)/.test(val);
      if(flag) {
        return function(val) {
          return ('' + val).trim().toLowerCase() === 'true';
        };
      } else {
        return flag;
      }
    },
    // 判断子节点的规则
    rule: function(val, rval) {
      if(val instanceof Array) {
        let tmpArr = [];
        for(let item of val) {
          let ret = validate(item, rval);
          if(!ret.success) {
            return false;
          } else {
            tmpArr.push(ret.data);
          }
        }
        return function() {
          return tmpArr;
        };
      }

      let ret = validate(val, rval);
      if(ret.success) {
        return function() {
          return ret.data;
        }
      } else {
        return false;
      }
    }
  };
  return function(data, rules) {
    // 对数据中每个字段进行验证
    let ret = {};
    let keys = Object.keys(rules);
    for(let key of keys) {
      let val = data[key];
      let rule = rules[key];
      if(val === undefined) {
        // 当数据不带有对应字段时
        if(!rule.required) continue;
        else return {
          field: key, // 第一个检测到失败的名称
          success: false,
          msg: `missing required value for ${key}`
        };
      }

      ret[key] = val;
      // 对每个字段的逐条规则进行验证
      let rkeys = Object.keys(rule);
      for(let rkey of rkeys) {
        let rval = rule[rkey];
        let flag = rmap[rkey](val, rval);
        if(!flag) {
          return {
            field: key, // 第一个检测到失败的名称
            success: false,
            msg: `invalid parameter value for ${key}`
          };
        }
        if(typeof flag === 'function') {
          // 需要做值转换
          ret[key] = flag(ret[key]);
        }
      }
    }
    return {
      data: ret, // 返回根据传入的规则得出的数据，只收集规则对象中出现过的字段(无视传入数据有但是规则中没有的字段)
      success: true, // 是否合法
    };
  };
})();

/**
 * 将带回调的函数包装成promise
 * 使用过程需要保证被包装的函数中回调是最后一个函数，并且其回调函数只接收两个参数，其一是异常对象，其二是返回数据。
 *
 * 如下使用：
 * wa(function(str1, str2, cb) {
 *   // 最后一个参数是回调
 *   dosth(str1, str2, function(err, ret1, ret2) {
 *     cb(err, ret1); // 回调中只接收两个参数，第一个是异常对象，第二个是返回数据
 *   });
 * });
 *
 */
var wa = exports.wa = function(func, scope) {
  return function() {
    let args;
    if(!arguments.length) {
      args = [];
    } else {
      args = [].slice.call(arguments);
      let temp = args.pop();
      if(typeof temp !== 'function') {
        args.push(temp);
      }
    }

    return new Promise(function(resolve, reject) {
      func.executor = function(err, data) {
        if(err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      };

      func.apply((scope || null), [].concat(args, [function(err, data) {
        if(err) reject(err);
        else resolve(data);
      }]));
    });
  };
};

/**
 * 将下划线连接的字段转成驼峰式
 */
exports.toCamel = function(str) {
  return str.replace(/_([a-zA-Z])/g, function(all, $1) {
    return $1.toUpperCase();
  });
};

/**
 * 将驼峰式转成下划线连接
 */
var toUnderline = exports.toUnderline = function(str) {
  return str.replace(/[A-Z]/g, function(all) {
    return '_' + all.toLowerCase();
  });
};


/**
 * 包装返回对象
 */
exports.wrapRet = function(codeMap) {
  codeMap = codeMap || defCodeMap;
  const otherErr = {code: 8000, msg: '未知异常'};
  return function(code, msg, result) {
    if(typeof msg !== 'string') {
      result = msg;
      msg = '';
    }
    let map = codeMap[code] || otherErr;
    return {
      code: map.code,
      msg: msg || map.msg,
      result: result || null
    };
  };
};
/**
 * 获取redis单例
 */
exports.getRedis = (function() {
  let client;
  return function() {
    if(!client) {
      client = redis.createClient({
        host: '127.0.0.1',
        port: '6379'
      });
      client.on('error', (err) => {
        console.log('不好，Redis挂了！');
        console.log(err.stack);
      });
    }
    client.getAsync = wa(client.get, client);
    return client;
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
