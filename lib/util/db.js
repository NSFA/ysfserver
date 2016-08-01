/**
 * 数据库操作工具
 * @author: june_01
 */
'use strict';

const mysql = require('mysql');
const GenSql = require('gen-sql');
const _ = require('./util');
const wa = _.wa;

const gen = new GenSql();
var pool = null;

const config = {
  connectionLimit: 100,
  database: 'june-test',
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root'
};

/**
 * 初始化连接池
 */
function initMysqlPool() {
  pool = mysql.createPool(config);
}

var db = {
  /**
   * 执行sql查询
   */
  query: function(sql, sqlParam, callback, connection) {
    let logger = global.logger;
    if(logger && logger.debug) {
      // 打印sql语句
      logger.debug(`执行sql语句：${sql}`, sqlParam);
    }

    var query;
    if(connection) {
      query = connection.query(sql, sqlParam, (err, rows) => callback(err, rows));
    } else {
      if(!pool) {
        initMysqlPool();
      }
      pool.getConnection(function(err, connection) {
        if(err) {
          callback(err);
          return;
        }
        query = connection.query(sql, sqlParam, function(err, rows) {
          connection.release();
          if(err) {
            callback(err)
          } else {
            callback(null, rows);
          }
        });
      });
    }
  },
  /**
   * 获取一个mysql连接
   */
  getConnection: wa(function(callback) {
    if(!pool) {
      initMysqlPool();
    }
    pool.getConnection(function(err, connection) {
      if(err) {
        connection && connection.release();
        callback(err, connection);
      } else {
        callback(null, connection);
      }
    });
  }),
  /**
   * 开始事务
   */
  beginTransaction: wa(function(callback) {
    if(!pool) {
      initMysqlPool();
    }
    pool.getConnection(function(err, connection) {
      if(err) {
        connection && connection.release();
        callback(err, connection);
      } else {
        connection.beginTransaction(function(err) {
          callback(err, connection);
        });
      }
    });
  }),
  /**
   * 结束并提交事务
   */
  commitTransaction: wa(function(connection, callback) {
    connection.commit(function(err) {
      connection.release();
      callback(err);
    });
  }),
  /**
   * 结束并回滚事务
   */
  rollbackTransaction: wa(function(connection, callback) {
    connection.rollback(function(err) {
      connection.release();
      callback(err);
    });
  }),
  /**
   * 执行增语句
   */
  add: function(obj, connection, callback) {
    if(typeof connection === 'function') {
      callback = connection;
      connection = null;
    }
    let genObj = gen.add(obj);
    db.query(genObj.sql, genObj.data, callback, connection);
  },
  /**
   * 执行删语句
   */
  del: function(obj, connection, callback) {
    if(typeof connection === 'function') {
      callback = connection;
      connection = null;
    }
    let genObj = gen.del(obj);
    db.query(genObj.sql, genObj.data, callback, connection);
  },
  /**
   * 执行改语句
   */
  update: function(obj, connection, callback) {
    if(typeof connection === 'function') {
      callback = connection;
      connection = null;
    }
    let genObj = gen.update(obj);
    db.query(genObj.sql, genObj.data, callback, connection);
  },
  /**
   * 执行查语句
   */
  find: function(obj, connection, callback) {
    if(typeof connection === 'function') {
      callback = connection;
      connection = null;
    }
    let genObj = gen.find(obj);
    db.query(genObj.sql, obj.realData || genObj.data, function(err, rows) {
      if(err) callback(err);
      else {
        let rets = [];
        for(let row of rows) {
          let keys = Object.keys(row);
          let ret = {};
          for(let key of keys) {
            let newKey = _.toCamel(key);
            ret[newKey] = row[key];
          }
          rets.push(ret);
        }
        callback(null, rets);
      }
    }, connection);
  }
};

module.exports = db;
