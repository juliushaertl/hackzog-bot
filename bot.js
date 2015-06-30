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
			channels: [this.config.channel],
			showErrors: true,
			autoConnect: true,
			autoRejoin: true,
			password: module.exports.config.user_password,
		});
		console.log("[hackzog-bot] connecting to server");
		bot.addListener("registered", function(message) {
			console.log("[hackzog-bot] connection established");
			bot.say('nickserv', 'IDENTIFY ' + module.exports.config.user_password);
		});
		bot.addListener("names", function(channel, nicks) {
			users = nicks;
		});
		bot.addListener("message", function(nick, to, text, message) {
			console.log("[hackzog-bot] message nick + " - " + to + ": " + text);
			if(text=="!help") {
				module.exports.respond(message, "!in         show active users");
				module.exports.respond(message, "!top        show top scores");
				module.exports.respond(message, "!karma NAME show karma of a user");
				module.exports.respond(message, "NAME +1     increment score for user");
				return;
			}
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

		/* Let the bot say something in the public channel */
	say: function(message) {
		bot.say(this.config.channel, message);
	},

		/* Let the bot respond to a message public or private */
	respond: function(message, response) {
		var returnpath = helpers.findReturnPath(message);
		bot.say(returnpath, response);
	},

	setTopic: function(text) {
		console.log("[hackzog-bot] set topic: " + text);
		bot.say("ChanServ", "TOPIC "+ this.config.channel + " " + text);
	},

};
