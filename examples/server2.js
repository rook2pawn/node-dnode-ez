var dnode_ez = require('../index');
var server = dnode_ez();
var clientEvents = {};
server.on('foobar',function(val,remote,conn) {
    console.log(val); 
});
server.on('connect',function(remote,conn) {
    // conn.id is unique per different connecting client
});
server.listen(5050);
server.on('bind',function(id) {
	clientEvents[id] = server.getEmitter(id);
});
console.log("Press a to emit wow on client emitter 1");
console.log("Press b to emit cool on client emitter 2");
console.log("Press c to emit foobar on server emitter 1");
process.stdin.resume(); 
process.stdin.setEncoding('utf8'); 
process.stdin.setRawMode(true); 
process.stdin.on('data', function(char) {
    if (char == '\3') {
        console.log('graceful exit');
        process.exit()
    }
    console.log("You entered -> " + char);
    switch (char) {
        case 'a' : 
                clientEvents['emitterNumber1'].emit('wow','The First Argument');
                break;
        case 'b' :
                clientEvents['emitterNumber2'].emit('cool','iseewhatyoudidthere');
                break;
        default :
                break;
    }
});
