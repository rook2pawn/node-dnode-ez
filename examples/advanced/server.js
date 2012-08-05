var ez = require('../../');
var EE = require('events').EventEmitter;

var clientEvents = new EE;
clientEvents.on('helpRequest', function() {
});

var server = ez();
var clients = {};
server.on('bind',function(id) {
    clients[id] = {};
    clients[id] = server.getEmitter(id);
});    
server.on('connect',function() {
    server.emit('welcome','You have arrived after a long journey.');
});
console.log("listening on 5000");
server.listen(5000);
process.stdin.resume(); 
process.stdin.setEncoding('utf8'); 
process.stdin.setRawMode(true); 
console.log("hit a to send a message");
process.stdin.on('data', function(char) {
    if (char == '\3') {
        console.log('graceful exit');
        process.exit()
    }
    console.log("You entered -> " + char);
    switch (char) {
        case 'a' : 
                clients['notifications'].emit('newMessage','This message is from the server.');
                break;
        default :
                break;
    }
});

