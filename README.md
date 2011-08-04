dnode-ez
========

DNode-ez makes Dnode even easier!

The server:
	
	var dnode_ez = require('dnode-ez');
	var server = dnode_ez();
	server.listen(5050);
	var baz = function(val) { console.log("Foobar! " + val);};
	server.on('foobar',baz);

The client:

	var dnode_ez = require('dnode-ez');
	var client = dnode_ez();
	client.connect(5050);
	client.emit('foobar','<-- Cool!');


	//  on the server
	> Foobar! <-- Cool!


