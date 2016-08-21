'use strict';
const fs = require('fs');
const mkTpl = require('../src/template');
const folder = require('../src/folder');

//fs.writeFileSync('te', mkTpl());
folder(require('./config.json'));

