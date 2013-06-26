var EventEmitter = require('events').EventEmitter;
var emitStream = require('emit-stream');
var muxdemux = require('mux-demux');
var count = 0;
exports.listenStream = function(stream) {
    this.connected = true;
    var mdm = muxdemux();
    stream.pipe(mdm).pipe(stream);
    emitStream(this.outgoing).pipe(mdm.createStream('eventstream'));
    var mdmconnect = function (stream) {
//        console.log(stream.meta + " readable: " + stream.readable + " writeable:" + stream.writable);
        if (stream.meta == 'eventstream') {
            this.incoming = emitStream(stream);
        }
        var ondata = function (data) {
            var type = data[0];
            var args = data[1];
            var name = data[1]._meta.name;
            delete args._meta;  
            this.routecb(type,args,name);
        };
        stream.on('data',ondata.bind(this));
    }
    mdm.on('connection', mdmconnect.bind(this));
}
exports.connectStream = function(stream) {
    var mdm = muxdemux();
    stream.pipe(mdm).pipe(stream);
    emitStream(this.outgoing).pipe(mdm.createStream('eventstream'));
    var mdmconnect = function (stream) {
//        console.log(stream.meta + " readable: " + stream.readable + " writeable:" + stream.writable);
        if (stream.meta == 'eventstream') {
            this.incoming = emitStream(stream);
        }
        var ondata = function (data) {
            var type = data[0];
            var args = data[1];
            var name = data[1]._meta.name;
            delete args._meta;  
            this.routecb(type,args,name);
        };
        stream.on('data',ondata.bind(this));
    };

    mdm.on('connection',mdmconnect.bind(this));
};
