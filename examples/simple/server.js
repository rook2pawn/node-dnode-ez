var ez = require('../../');
var server = ez();
server.on('connect',function() {
    server.emit('welcome','You have arrived after a long journey.');
});
server.listen(5000);
