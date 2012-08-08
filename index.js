var dnode = require('dnode');
var shoe = require('shoe');
var parseArgs = require('./node_modules/dnode/lib/parse_args');
var EE = require('events').EventEmitter;
var ez = function(obj) {
    var emitter = new EE;
    var utilEmitter = new EE;
    utilEmitter.on('emit',function() {
        var args = [].slice.call(arguments,0);
        remote.emitter.apply(remote.emitter,args);
    });
    // this subscribes all the current clients to an existing server Event so clients
    // can fire onto the server ...
    // i.e. CustomerHelpNeeded "Help I can't login" (clients can fire upon the server)
    utilEmitter.on('subscribeClient',function(emitter,name,connid) {
        var args = [].slice.call(arguments,0);
        var emitter = args[0];
        var name = args[1];
        clients[connid].remote.subscribe(emitter.emit.bind(emitter),emitter,name);
    });
    // this subscribes the server to an existing client Event so the server
    // can fire onto the client
    // i.e. SystemMessages aka "the system is shutting down in 5 minutes"  (server can fire upon the client)
    utilEmitter.on('subscribe',function(emitter,name) {
        var args = [].slice.call(arguments,0);
        var emitter = args[0];
        var name = args[1];
        if (myRemote !== undefined) {
            // then this is a server subscribing to a client side event.
            myRemote.subscribe(emitter.emit.bind(emitter),emitter,name);
        } 
    });
    utilEmitter.on('connect',function(remote,conn) {
        //anything bookeepingish here  
        //console.log("connid connect:" + conn.id);
        if (clients[conn.id] === undefined) {
            clients[conn.id] = {};
        }
        clients[conn.id].conn = conn;
    });
    var subscriptionsById = {};
    var subscriptionsByName = {};
    var reservedEvents = ['bind','connect','end','incomingBinds'];
    utilEmitter.on('connectionready',function(conn) {
        connectionReady = true;
    });
    var connectionReady = false;

    var expectedBinds = [];
    var bindsMade = 0;
    var serverEvents = undefined;
    var clients = {};
    var myRemote = undefined;

	var offer = function(remote,conn) {
        if (obj !== undefined) {
            var name = undefined;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    this[name] = obj[name];
                }
            }
        }
		this.emitter = function() {
			var args = [].slice.call(arguments,0);
            args.push(remote);
            args.push(conn);
			emitter.emit.apply(emitter,args);
		}
		this.subscribe = function(emitter,emitterObj,id) {
			if (subscriptionsById[conn.id] === undefined) 
				subscriptionsById[conn.id] = {};
			if (subscriptionsByName[id] === undefined)
				subscriptionsByName[id] = {};
			var subObj = {
				id:id,
				emitter:emitter,
				events:Object.keys(emitterObj._events),
				emit:emitter
			};
			subscriptionsById[conn.id] = subObj;
			subscriptionsByName[id] = subObj;
			utilEmitter.emit('bind',id,remote,conn);
		};	
        this.expectedBinds = function(binds) {
            clients[conn.id].expectedBinds = binds;
            clients[conn.id].bindsMade = 0;
        };
		conn.on('ready',function() {
			utilEmitter.emit('connectionready',conn);
		});
        conn.on('end',function() {
            utilEmitter.emit('end',remote,conn);
        });
	};
    var d = dnode(offer);
	var self = {};
	self.connect = function(address) {
        serverEvents = d.connect(address);
        serverEvents.on('remote',function(remote,conn) {
            myRemote = remote;
            utilEmitter.emit('connectionready');
            utilEmitter.emit('connect',remote,conn);    
        });
	};
    self.connectWEB = function() {
        var stream = shoe('/dnode');
        serverEvents = d.pipe(stream).pipe(d); 
        serverEvents.on('remote',function(remote,conn) {
            myRemote = remote;
            utilEmitter.emit('connectionready');
            utilEmitter.emit('connect',remote,conn);    
        });
    };
	self.listen = function(address) {
        var params = parseArgs(arguments);
        serverEvents = d.listen(params);
        serverEvents.on('remote',function(remote,conn) {
            if (clients[conn.id] === undefined) {
                clients[conn.id] = {};
            }
            clients[conn.id].remote = remote;
            utilEmitter.emit('connectionready');
            utilEmitter.emit('connect',remote,conn);    
        });
	};
	self.listenWEB = function(address,server) {
        server.listen(address);
        var sock = shoe(function (stream) {
            serverEvents = d.pipe(stream).pipe(d);
            serverEvents.on('remote',function(remote,conn) {
                if (clients[conn.id] === undefined) {
                    clients[conn.id] = {};
                }
                clients[conn.id].remote = remote;
                utilEmitter.emit('connectionready');
                utilEmitter.emit('connect',remote,conn);    
            });
        });
        sock.install(server, '/dnode');
	};
    self.getEmitterByConnId = function(id,name) {
        if (subscriptionsById[id] !== undefined) {
            return subscriptionsById[id];
        };
    };
	self.getEmitter = function(name) {
		if (subscriptionsByName[name] !== undefined)
			return subscriptionsByName[name];
	};
	self.emit = function() {
		var args = [].slice.call(arguments,0);
		if (connectionReady) {
			var newargs = [].concat('emit',args);
			utilEmitter.emit.apply(utilEmitter,newargs);
		} else { 
			setTimeout(function() {
				self.emit.apply(self.emit,args);
			}, 250);
		}
		return self;
	}
	self.bind = function(emitter,name) {
		var args = [].slice.call(arguments,0); 
        args.shift();
        args.forEach(function(name) {
            if (connectionReady) {
                utilEmitter.emit('subscribe', emitter,name);
            } else {
                setTimeout(function() {
                    self.bind.apply(self.bind,[emitter,name]);
                }, 250);
            } 
        });
		return self;
	};
	self.bindToClients = function(emitter,name) {
		var args = [].slice.call(arguments,0); 
        args.shift();
        args.forEach(function(name) {
            if (connectionReady) {
                Object.keys(clients).forEach(function(connid) {
                    utilEmitter.emit('subscribeClient', emitter,name,connid);
                });
            } else {
                setTimeout(function() {
                    self.bindToClients.apply(self.bindToClients,[emitter,name]);
                }, 250);
            } 
        });
		return self;
	};
	self.on = function(name, fn) {
        //console.log("SELF.ON " + name);
		if (reservedEvents.indexOf(name) == -1) {
            //console.log("ladoing up emitter on " + name);
			emitter.on(name,fn);
		} else {
            //console.log("Loading up utilEmitter on " + name);
			utilEmitter.on(name,fn);
		}
	};
    // this is actually close all, and for servers only (i.e. instantiated for .listen)
    self.close = function() {
        serverEvents.close();
        Object.keys(clients).forEach(function(key) {
            clients[key].conn.end();
        });
    };    
    self.closeByConnectionId = function(id) {
        //console.log("Closed " + id);
        clients[id].conn.end();
        return id;
    };
	return self;
};
exports = module.exports = ez;
