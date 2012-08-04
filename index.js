var dnode = require('dnode');
var protocol = require('dnode-protocol');
var EE = require('events').EventEmitter;
var ez = function(obj) {
	var emitter = new EE;
	var utilEmitter = new EE;
	var subscriptionsById = {};
	var subscriptionsByName = {};
	var reservedEvents = ['bind','connect','end','incomingBinds'];
	utilEmitter.on('connectionready',function() {
		connectionReady = true;
	});
	var connectionReady = false;

    var expectedBinds = [];
    var bindsMade = 0;
    var clients = {};

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
	};
	var app = function(remote,conn) {
		conn.on('ready',function() {
            //console.log("Connection from " + conn.id + " established.");
			utilEmitter.emit('connectionready');
            utilEmitter.emit('connect',remote,conn);
		});
        conn.on('end',function() {
            //console.log("Connection from " + conn.id + " closed.");
            utilEmitter.emit('end',remote,conn);
        });
		utilEmitter.on('emit',function() {
			var args = [].slice.call(arguments,0);
			remote.emitter.apply(remote.emitter,args);
		});
		utilEmitter.on('subscribe',function() {
			var args = [].slice.call(arguments,0);
			var emitter = args[0];
			var name = args[1];
			remote.subscribe(emitter.emit.bind(emitter),emitter,name);
		});
        utilEmitter.on('connect',function() {
            //anything bookeepingish here  
            clients[conn.id] = {};
        });
	};
	var d = dnode(offer);
	var self = {};
	self.connect = function(address) {
        d.connect(address,app);
		return self;
	};
	self.listen = function(address) {
        //var params = protocol.parseArgs(arguments);
        //params.block = app;
        //return d.listen(params);
        return d.listen(address);
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
	self.on = function(name, fn) {
		if (reservedEvents.indexOf(name) == -1) {
			emitter.on(name,fn);
		} else {
			utilEmitter.on(name,fn);
		}
	};
	self.utilEmitter = function() {
		return utilEmitter;
	};
	return self;
};
exports = module.exports = ez;
