var dnode_ez = require('../index');
var server = dnode_ez();
server.on('foobar',function(val) {console.log("Server foobar! "+val);});
server.listen(5050);
setTimeout(function() { 
	var clEmArray = server.getEmitter('justAnotherEmitter');
	var clEmitter = clEmArray.shift();
	clEmitter.emitter.emit('wow');
	console.log(clEmitter);
},9000);
