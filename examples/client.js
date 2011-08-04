var dnode_ez = require('../index');
var client = dnode_ez();
client.connect(5050);
client.emit('foobar',' <-- nice!');
