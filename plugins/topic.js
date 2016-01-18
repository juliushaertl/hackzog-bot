var helpers = require("../helpers");
var request = require('request');

var bot = null;
var topic_data = {};
var topic_template = " http://hackzogtum-coburg.de | {spacestatus} | Anwesenheitsliste: http://in.hackzogtum-coburg.de";
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
var setTopicTemplate = function(nick, to, text, message) {
	if(nick == "verifiedusername" && message['args'][0] == "hackzog") {
		new_tpl = text.replace("!settopic ","");
		topic_template = new_tpl;
		console.log("[hackzog-bot] new topic set by " + nick + ": " + new_tpl);
		updateTopic();
	} else
		return;
}

module.exports = {
	register: function(b) {
		bot = b;
		bot.addMessageAction(function(nick, to, text, message) {
			if(text.indexOf("!settopic" == -1))
				return false;
			else
				return true;
		}, setTopicTemplate);
	},
	updateTopic: updateTopic,
	setTopicTemplate: setTopicTemplate,
	addData: function(key, value) {
		console.log("[hackzog-bot] add data to topic " + key + " = " + value);
		topic_data[key] = value;
	},
	help: [
	],
};
