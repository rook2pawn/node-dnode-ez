var dnode_ez = require('../index');
var EE = require('events').EventEmitter;
var emitter = new EE;
emitter.on('wow',function(arg1) {console.log("emitter1: Arg1: " + arg1)});
var emitter2 = new EE;
emitter2.on('cool',function(arg1) {console.log("emitter2: Arg1: " + arg1)});
var client = dnode_ez();
client.on('connect',function(remote,conn) {
    // the conn.id here is less relevant than the server2.js conn.id 
    // however you can put any on connect code here.
});
client.connect(5050);
client.bind(emitter,'emitterNumber1');
client.emit('foobar','from the client.. hello!');
client.bind(emitter2,'emitterNumber2');
console.log("Press c to emit foobar on server emitter 1");
process.stdin.resume();
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(char) {
    if (char == '\3') {
        console.log('graceful exit');
        process.exit()
    }   
    console.log("You entered -> " + char);
    switch (char) {
        case 'c' :
                client.emit('foobar','Really man?');
                break;
        default :
                break;
    }
});
