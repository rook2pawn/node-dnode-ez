var dnode = require('dnode');
var EE = require('events').EventEmitter;
var ez = function() {
	var emitter = new EE;
	var utilEmitter = new EE;
	var subscriptionsById = {};
	var subscriptionsByName = {};
	var reservedEvents = ['bind'];
	utilEmitter.on('connectionready',function() {
		connectionReady = true;
	});
	var connectionReady = false;
	var offer = function(remote,conn) {
		this.emitter = function(name,args) {
			emitter.emit.apply(emitter,[name,args]);
		}
		this.subscribe = function(emitter,emitterObj,id) {
			if (subscriptionsById[conn.id] === undefined) 
				subscriptionsById[conn.id] = [];
			if (subscriptionsByName[id] === undefined)
				subscriptionsByName[id] = {};
			var subObj = {
				id:id,
				emitter:emitter,
				events:Object.keys(emitterObj._events),
				emit:emitter
			};
			subscriptionsById[conn.id].push(subObj);
			subscriptionsByName[id] = subObj;
			utilEmitter.emit('bind');
		};	
	};
	var app = function(remote,conn) {
		conn.on('ready',function() {
			utilEmitter.emit('connectionready');
		});
		utilEmitter.on('emit',function() {
			var args = [].slice.call(arguments,0);
			var name = args[0];
			var rest = args.slice(1);
			remote.emitter(name, rest);
		});
		utilEmitter.on('subscribe',function() {
			var args = [].slice.call(arguments,0);
			var emitter = args[0];
			var name = args[1];
			remote.subscribe(emitter.emit.bind(emitter),emitter,name);
		});
	};
	var d = dnode(offer);
	var self = {};
	self.connect = function(address) {
		d.connect(address,app);
		return self;
	};
	self.listen = function(address) {
		d.listen(address,app);
		return self;
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
		if (connectionReady) {
			utilEmitter.emit('subscribe', emitter,name);
		} else {
			setTimeout(function() {
				self.bind.apply(self.bind,[emitter,name]);
			}, 250);
		} 
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
