var helpers = require("../helpers");
var request = require('request');

var bot = null;
var topic_data = {};
var topic_template = " http://hackzogtum-coburg.de | {spacestatus} | Anwesenheitsliste: http://in.hackzogtum-coburg.de";
    topic_template += " | {countdown-cccamp} days until camp";
var topic_old = "";

var updateTopic = function() {
	topic = topic_template;
	for(var key in topic_data) {
		topic = topic.replace("{"+key+"}",topic_data[key]);
	}
	if(topic_old != topic)
		bot.setTopic(topic);
	topic_old = topic;
}
var getCurrentTopic = function(nick, to, text, message) {
	updateTopic();
	bot.respond(message, topic_old);
}

module.exports = {
	register: function(b) {
		bot = b;
		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("!topic") == -1)
				return false;
			return true;
		}, getCurrentTopic);
	},
	updateTopic: updateTopic,
	addData: function(key, value) {
		console.log("[hackzog-bot] add data to topic " + key + " = " + value);
		topic_data[key] = value;
	},
	help: [
	],
};
