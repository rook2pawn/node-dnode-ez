var http = require('http');
var libhttp = require('./lib/http');
var libev = require('./lib/events');
var net = require('net');
var Stream = require('stream');
var shoe = require('shoe');
var lib = require('./lib');
var ee = require('events').EventEmitter;
var ez = function(opts) {
    this.util = new ee;
    var outgoing = new ee;
    this.outgoing = outgoing;
    this.incoming = undefined;
    this.connected = false;
    this.routecb;
    this.map = {};
    this.util.on('emit',function() {
        var type = arguments[0][0];
        var args = arguments[0][1];
        var name = arguments[1];
        args._meta = {name:name};
        outgoing.emit(type,args);
    });
    this.link = function(e,name) {
        e.name = name;
        e.emit = libev.EventEmitter.prototype.emit.bind({util:this.util,name:name});
    };
    this.connect = function() {
        var args = [].slice.call(arguments,0);     
        var host = 'localhost'; 
        var cb; 
        var port = args[0];
        if (typeof args[1] == 'function') {
            cb = args[1];
        } else {
            host = args[1];
            cb = args[2];
        }
        if (net.hasOwnProperty('connect')) {
            var onconnect = function(){
                this.connected = true;
                lib.connectStream.call(this,stream);
                cb();
            };
            var stream = net.connect(port,host,onconnect.bind(this));
        } else {
            var stream = shoe('/dnode');
            stream.on('connect',lib.connectStream(stream).bind(this));
        }
    };
    this.routecb = function(type, args, name) {
        if (this.map[name] !== undefined) { 
            this.map[name].emit(type,args);
        }
    }
    this.route = function() {
        var args = [].slice.call(arguments,0);     
        if (typeof args[0] == 'string') {
            this.map[args[0]] = args[1];
        } else {
            this.link(args[0],args[1]);
        }
    };
    this.listen = function(num) {
        var server = net.createServer();
        server.listen(num);
/*
        var sock = shoe(lib.listenStream);
        sock.install(server,'/dnode');
*/
        server.on('connection',lib.listenStream.bind(this));
    };
};

module.exports = exports = ez;
/*
        var s = new Stream;
        s.writable = true;
        s.readable = true;
        var bytes = 0;
        s.write = function (buf) {
            bytes += buf.length;
            console.log(buf.toString());
            console.log("\n\nBytes:"+bytes);
            s.emit('data',buf); //passthru
        };

        s.end = function (buf) {
            if (arguments.length) s.write(buf);
            s.writable = false;
            console.log(bytes + ' bytes written');
        };

        s.destroy = function () {
            s.writable = false;
        };
        var server = http.createServer(require('ecstatic')(__dirname));
        server.removeAllListeners('connection');
        server.on('connection',function(stream) {
            console.log(stream.read(3).toString());
            stream.ondata = function(d,start,end) {
                if (d.slice(start,end).toString().slice(0,3) == 'GET') {
                    stream.unshift(d);
                    libhttp._connectionListener(stream);
                }
            };
//libhttp._connectionListener);
//lib.listenStream);
*/
