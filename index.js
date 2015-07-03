var dnode = require('dnode');
var util = require('util');
var ee = require('events').EventEmitter;
var ez = function() {
    var send = function() {
        var arglist = [].slice.call(arguments);
        this.routecb.apply(this,arglist);
    };
    var offer = {
        send : send.bind(this)
    };
    this.type;
    this.clients = {};
    this.dz = dnode(offer);
    var remote = function(remote,conn) {
        this.clients[conn.id] = {remote: remote};
        this.emit('connect');
    };
    this.dz.on('remote',remote.bind(this));
    this.map = {};
    this.link = function(ev,name) {
        var emit = function() {
            // if (we are server sending to client)
            /// there has to be a better way to do self-identify. because we want link whenever before we listen or connect
            // .. also in this section right now the server will end up emitting to all clients
            // but we can change that to specific channels in the future.
            if (this.listenobj !== undefined) {
                var list = Object.keys(this.clients);
                for (var i = 0; i < list.length; i++) {
                    var connid = list[i];
                    var arglist = [].slice.call(arguments);
                    arglist.unshift(name);
                    this.clients[connid].remote.send.apply(null,arglist); 
                } 
            } else {
            // if we are client sending to server
                var list = Object.keys(this.clients);
                for (var i = 0; i < list.length; i++) {
                    var connid = list[i];
                    var arglist = [].slice.call(arguments);
                    arglist.unshift(name);
                    this.clients[connid].remote.send.apply(null,arglist); 
                } 
            }
        };    
        ev.emit = emit.bind(this);
    }
    this.routecb = function() {
        var arglist = [].slice.call(arguments);
        var name = arglist[0]; var type = arglist[1]; 
        var theargs = arglist.slice(2,arglist.length);
        this.map[name]._events[type].apply(this,theargs);
    }
    this.route = function() {
        var args = [].slice.call(arguments,0);     
        if (typeof args[0] == 'string') {
            var name = args[0];
            var ev = args[1];
        } else {
            var name = args[1];
            var ev = args[0];
        }
        this.map[name] = ev;
        this.link(ev,name);
    };
    this.listenobj = undefined;
    this.listen = function(port) {
        this.type = 'server'
        this.listenobj = this.dz.listen(port);
        var remote = function(remote,conn) {
            this.emit('connect');
            this.clients[conn.id] = {remote: remote};
        };
        this.listenobj.on('remote',remote.bind(this));
    };
    this.connect = function(port) {
        this.type = 'client'
        this.dz.connect(port,function(remote,conn) {
        });
    };
};
util.inherits(ez,ee);
module.exports = exports = ez;
