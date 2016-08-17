const Server = require('../src/server');

new Server(require('./config.json')).on('error', function(err, ctx){
	console.log(err.stack);
})