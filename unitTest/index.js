const Mocha = require('mocha');

const mocha = new Mocha({})
mocha.addFile('./demo.js');


mocha.run(function(){
	console.log('done');
}).on('pass', function(test){
	// console.log('... %s', test.title);
});