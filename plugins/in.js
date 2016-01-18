// !in
// list currently active users in our hackerspace
var helpers = require("../helpers");
var request = require('request');

var bot = null;
var api;
var open = false;
var open_old = false;
var initial_set= true;

var getApi = function() {
	var in_url = "http://hades.bitgrid.net/~jus/in/api.php?action=current";
	request({
		url: in_url,
		json: true
	}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			api = body
				open_old = open;
			if(api['count']>0)
				open = true;
			else
				open = false;
			setOpenState();
		}
	});
}

var setOpenState = function() {
	if(open == open_old && !initial_set)
		return;
	if(open) {
		bot.plugins['topic'].addData('spacestatus', "OPEN");
	} else {
		bot.plugins['topic'].addData('spacestatus', "CLOSED");
	}
	initial_set = false;
	bot.plugins['topic'].updateTopic();
}

var inHandler = function(nick, to, text, message) {

	getApi();

	if(typeof api !== 'undefined')
		if(api['count'] == 0)
			bot.respond(message, "Nobody here!");
		else
			bot.respond(message, api['users'].join(', '));

};

module.exports = {
	register: function(b) {

		bot = b;

		getApi();
		setInterval(function() {
			getApi();
		}, 60*1000);

		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("!in") == -1)
				return false;
			return true;
		}, inHandler);

	},
	help: [
		['!in', 'show active users'],
	],
};
