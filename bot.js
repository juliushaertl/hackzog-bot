var irc = require("irc");
var helpers = require("./helpers");
var bot;
var users = [];
var plugins = [];

module.exports = {

	config: {
	},

	// Connect to IRC server and identify with NickServ
	connect: function() {

		bot = new irc.Client(this.config.server, this.config.user, {
			channels: this.config.channels,
			autoConnect: false,
		});

		bot.connect(3, function() {
			bot.say("nickserv", "identify "+ module.exports.config.password);
		});

		console.log("[hackzog-bot] connecting to server");
		bot.addListener("registered", function(message) {
			console.log("[hackzog-bot] connection established");
		});
		bot.addListener("names", function(channel, nicks) {
			users = nicks;
		});
		bot.addListener("message", function(nick, to, text, message) {
			for(var i=0; i<plugins.length; i++) {
				if(plugins[i][0](nick, to, text, message)) {
					plugins[i][1](nick, to, text, message);
					return;
				}
			}
		});

	},

	names: function() {
		return users;
	},	

	// Load plugins from array list
	loadPlugins: function(plugins) {

		for(var i = 0, len = plugins.length; i < len; i++) {
			var name = plugins[i];
			var plugin = require('./plugins/'+name);
			plugin.register(this);
		}

	},

	addMessageAction: function(match, callback) {
		plugins.push([match, callback]);	
	},

	addListener: function(type, callback) {
		bot.addListener(type, callback);
	},

	say: function(channel, message) {
		bot.say(channel, message);
	},

	respond: function(message, response) {
		var returnpath = helpers.findReturnPath(message);
		bot.say(returnpath, response);
	},

};