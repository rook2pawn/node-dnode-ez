var ez = require('../../');
var ee = require('events').EventEmitter;
var notifications = new ee;
var client = ez();
notifications.on('newMessage',function(msg) {
    console.log("new message! : " + msg);
});
client.on('welcome', function(msg) {
    console.log("Welcome!");
    console.log(msg);
});
client.connect(5000);
client.bind(notifications,'notifications');
