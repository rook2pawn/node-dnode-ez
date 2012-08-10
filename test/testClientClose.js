// test that when a client closes, the connection closes to the server for THAT client
// and the server deletes that client from the clients list
// and the server gets an end event 
var test = require('tap').test;
var ez = require('../index');

test('testClientClose', function(t) {
    t.plan(1);
    var d = ez();
    d.listen(12345);
    var clientList = [];
    var id = undefined;
    d.on('end', function(remote,conn,clients) {
        clientList = clients;
    });
    d.on('connect',function(remote,conn) {
        remote.emit('welcome', "Hi there, " + conn.id, conn.id);  
        console.log("Server got a connection." + conn.id);
    });


    var a = ez();
    a.on('welcome',function(msg) {
        console.log("a: System message:\n"+msg); 
        a.close();
    });
    a.connect(12345);

    var b = ez();
    b.on('welcome',function(msg,connid) {
        id = connid;
        console.log("b: System message:\n"+msg); 
    });
    b.connect(12345);

    setTimeout(function() {
        var f = ez();
        f.on('welcome',function(msg) {
            console.log("F: System message:\n"+msg); 
            f.close();
            // only thing in the client list should be client b
            var other = clientList.pop();
            t.equal(id, other);
            d.closeServer();
            t.end()
        });
        f.connect(12345);
    },1000);
});
