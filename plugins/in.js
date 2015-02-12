// !in
// list currently active users in our hackerspace
var helpers = require("../helpers");
var request = require('request');

var bot = null;

var inHandler = function(nick, to, text, message) {

	var in_url = "http://hades.bitgrid.net/~jus/in/api.php?action=current";
	request({
		url: in_url,
		json: true
	}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			if(body['count'] == 0)
				bot.respond(message, "Nobody here!");
			else
				bot.respond(message, body['users'].join(', '));
		}
	});

};

module.exports = {
	register: function(b) {

		bot = b;

		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("!in") == -1)
				return false;
			return true;
		}, inHandler);

	},
};
