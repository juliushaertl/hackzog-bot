var irc = require("irc");
var helpers = require("./helpers");
var bot;
var users = [];
var plugin_actions = [];
var plugins = {};
var active = false;

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
			active = true;
		});
		bot.addListener("names", function(channel, nicks) {
			users = nicks;
		});
		bot.addListener("message", function(nick, to, text, message) {
			console.log("[hackzog-bot] message " +nick + " - " + to + ": " + text);
			if(text=="!help") {
				module.exports.respond(message, "!countdown  show days until events");
				module.exports.respond(message, "!in         show active users");
				module.exports.respond(message, "!top        show top scores");
				module.exports.respond(message, "!karma NAME show karma of a user");
				module.exports.respond(message, "NAME +1     increment score for user");
				return;
			}
			for(var i=0; i<plugin_actions.length; i++) {
				if(plugin_actions[i][0](nick, to, text, message)) {
					plugin_actions[i][1](nick, to, text, message);
					return;
				}
			}
		});

	},

	names: function() {
		return users;
	},

		// Load plugins from array list
	loadPlugins: function(plugins_load) {

		for(var i = 0, len = plugins_load.length; i < len; i++) {
			var name = plugins_load[i];
			plugins[name] = require('./plugins/'+name);
			plugins[name].register(this);
			console.log("[hackzog-bot] load plugin " + name);
		}

	},

	addMessageAction: function(match, callback) {
		plugin_actions.push([match, callback]);
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
		if(!active)
			setTimeout(function() {
				module.exports.setTopic(text);
			}, 5000);
		else
			bot.say("ChanServ", "TOPIC "+ this.config.channel + " " + text);
	},
	plugins: plugins,

};
