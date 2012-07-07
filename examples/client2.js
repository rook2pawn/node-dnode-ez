var dnode_ez = require('../index');
var EE = require('events').EventEmitter;
var emitter = new EE;
emitter.on('wow',function(arg1) {console.log("Wow. Just wow."); console.log("Arg1: " + arg1)});
var emitter2 = new EE;
emitter2.on('cool',function(arg1) {console.log("Super cool."); console.log("Arg1: " + arg1)});
var client = dnode_ez();
client.connect(5050);
client.bind(emitter,'justAnotherEmitter');
client.emit('foobar',' <-- nice!');
client.bind(emitter2,'woohoo');
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
        case 'c' :
                client.emit('foobar','Really man?');
                break;
        default :
                break;
        }
    }
});

