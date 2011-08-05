var dnode_ez = require('../index');
var server = dnode_ez();
server.on('foobar',function(val) {console.log("Server foobar! "+val);});
server.listen(5050);
var emitterOnClient = undefined;
server.on('alertSubscribe',function() {
	emitterOnClient = server.getEmitter('justAnotherEmitter');
	emitterOnClient.emit('wow');
});
function foo () {
	console.log("EmitterOnClient:");
	console.log(emitterOnClient);
	if (emitterOnClient === undefined)
		setTimeout(foo, 250);
	else 
		return emitterOnClient;
};

foo();
