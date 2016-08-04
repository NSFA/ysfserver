'use strict';
const path = require('path');
const Profile = require('../src/profile');
var profile = new Profile(path.join(process.cwd(), './config.json'));

profile.init();

