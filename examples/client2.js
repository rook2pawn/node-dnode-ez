var dnode_ez = require('../index');
var EE = require('events').EventEmitter;
var emitter = new EE;
emitter.on('wow',function(arg1) {console.log("Wow. Just wow."); console.log("Arg1: " + arg1)});
var emitter2 = new EE;
emitter2.on('cool',function(arg1) {console.log("Super cool."); console.log("Arg1: " + arg1)});
var client = dnode_ez();
client.on('connect',function() {
    // connect here 
});
client.connect(5050);
client.bind(emitter,'justAnotherEmitter');
client.emit('foobar',' <-- nice!');
client.bind(emitter2,'woohoo');
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

