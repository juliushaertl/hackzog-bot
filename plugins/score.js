var redis = require("redis");
var client = redis.createClient();

var helpers = require("../helpers");

var bot = null;

client.on("error", function (err) {
	console.log("Error " + err);
});

// +1 command
// Increase user score when mentioning him with +1 in text
var scoreHandlerIncrement = function(nick, to, text, message) {

	client.hkeys("hackzog-score", function(err,object) {
		var accepted_names = object.concat(Object.keys(bot.names()));

		var names = text.split(" ").remove("+1");
		for(var i=0; i<names.length;i++) {

			name = names[i].replace(/\:+/g, '').replace(/\ +/g, '');
			if(!name || name.length === 0)
				break;
			if(accepted_names.indexOf(name) == -1) {
				bot.respond(message, "No user " + name + " in here!");
				break;
			}
			if(nick == name) {
				bot.respond(message, "Shame on you ... don't +1 yourself!");	
				return;
			}

			bot.respond(message, nick + " gave +1 to '" + name + "'");
			client.hincrby("hackzog-score",name,1);

		}
	});

};

// !top command
// Show top 5 users with highest score
var scoreHandlerTop = function(nick, to, text, message) {

	client.hgetall("hackzog-score", function(err, object) {
		score = object;
		var score_sort = [];
		for(var i in object) {
			if(!Array.isArray(score[object[i]]))
				score[object[i]] = new Array();
			score[object[i]].push(i); 	
			score_sort.push(object[i]);
		}
		score_sort.sort(function(a,b) { return b-a; });
		for(var i = 0, j = 0; i<score_sort.length && i<5;i++) {
			var name = score[score_sort[i]][j].replace(/\s+/g, '').replace(/\:+/g, '');
			if(score_sort[i]==score_sort[i+1])
				j++;
			else
				j=0;
			bot.respond(message,score_sort[i] + "+ " + name);
		}

	});

};

module.exports = {
	register: function(b) {
		bot = b;
		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("+1") == -1)
				return false;
			return true;
		}, scoreHandlerIncrement);
		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("!top") == -1)
				return false;
			return true;
		}, scoreHandlerTop);


	},
};
