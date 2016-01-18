var schedule = require('node-schedule');
var moment = require("moment");

var bot = null;
var countdowns = {
	cccamp: '2015-08-13 00:00:00',
	'32c3': '2015-12-27 00:00:00',
};

var getDays = function(until) {
	var startDateTime = moment();
	var endDateTime = moment(until);
	var timeLeft = endDateTime.diff(startDateTime, 'milliseconds', true);
	var days = Math.floor(moment.duration(timeLeft).asDays());
	return days;
}

var getCountdown = function(nick, to, text, message) {
	for(var key in countdowns) {
		bot.respond(message, getDays(countdowns[key]) + " day(s) until " + key);
	}
}

var updateCountdown = function() {
	for(var key in countdowns) {
		bot.plugins['topic'].addData('countdown-'+key, getDays(countdowns[key]));
	}
	bot.plugins['topic'].updateTopic();
}

module.exports = {
	register: function(b) {
		bot = b;
		updateCountdown();
		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("!countdown") == -1)
				return false;
			return true;
		}, getCountdown);
		var job = schedule.scheduleJob('0 0 * * *', function(){
			updateCountdown();
		});
	},
	updateCountdown: updateCountdown,
	help: [
		['!countdown', 'show countdown until $event in days'],
	],
};

