var dnode_ez = require('../index');
var server = dnode_ez();
server.on('foobar',function(val) {console.log("Server foobar! "+val);});
server.listen(5050);
var foo = undefined;
var bar = undefined;
server.on('bind',function(id) {
	var emitterOnClient = server.getEmitter(id);
    switch (emitterOnClient.id) {
        case 'justAnotherEmitter' : emitterOnClient.emit('wow');
                foo = emitterOnClient;
                break;
        case 'woohoo' : emitterOnClient.emit('cool');
                bar = emitterOnClient;
                break;
        default :
                break;
    }
});


console.log("Press a to emit wow on client emitter 1");
console.log("Press b to emit cool on client emitter 2");
console.log("Press c to emit foobar on server emitter 1");
var tty = require('tty');
process.stdin.resume();
process.stdin.setRawMode(true);
process.stdin.on('keypress', function(char, key) {
    if (key && key.ctrl && key.name == 'c') {
        console.log('graceful exit');
        process.exit()
    }
    if (key !== undefined) {
        console.log("You entered -> " + key.name);
        switch (key.name) {
        case 'a' : 
                foo.emit('wow','The First Argument');
                break;
        case 'b' :
                bar.emit('cool','iseewhatyoudidthere');
                break;
        default :
                break;
        }
    } 
});
