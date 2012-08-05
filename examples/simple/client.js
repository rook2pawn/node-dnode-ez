var ez = require('../../');
var client = ez();
client.on('welcome', function(msg) {
    console.log("Welcome!");
    console.log(msg);
});
client.connect(5000);
