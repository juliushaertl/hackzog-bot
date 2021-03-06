var redis = require("redis");
var bodyParser = require('body-parser')
var client = redis.createClient();
var helpers = require("../helpers");

var bot = null;
var http = null;

client.on("error", function (err) {
	console.log("[hackzog-bot] redis error " + err);
});

// +1 command
// Increase user karma when mentioning him with +1 in text
var karmaHandlerIncrement = function(nick, to, text, message) {

	client.hkeys("hackzog-karma", function(err,object) {
		var accepted_names = object.concat(Object.keys(bot.names()));

		var names = text.split(" ").remove("+1");
		for(var i=0; i<names.length;i++) {

			name = names[i].replace(/\:+/g, '').replace(/\ +/g, '');
			if(!name || name.length === 0)
				break;
			if(accepted_names.indexOf(name) == -1) {
				//bot.respond(message, "No user " + name + " in here!");
				break;
			}
			if(nick == name) {
				bot.respond(message, "Shame on you ... don't +1 yourself!");	
				return;
			}

			bot.say(nick + " gave +1 to '" + name + "'");
			console.log("[hackzog-bot] " +nick + " gave +1 to '" + name + "'");
			client.hincrby("hackzog-karma",name,1);

		}
	});

};

// !top command
// Show top 5 users with highest karma
var karmaHandlerTop = function(nick, to, text, message) {

	client.hgetall("hackzog-karma", function(err, object) {
		karma = object;
		var karma_sort = [];
		for(var i in object) {
			if(!Array.isArray(karma[object[i]]))
				karma[object[i]] = new Array();
			karma[object[i]].push(i); 	
			karma_sort.push(object[i]);
		}
		karma_sort.sort(function(a,b) { return b-a; });
		for(var i = 0, j = 0; i<karma_sort.length && i<5;i++) {
			var name = karma[karma_sort[i]][j].replace(/\s+/g, '').replace(/\:+/g, '');
			if(karma_sort[i]==karma_sort[i+1])
				j++;
			else
				j=0;
			bot.respond(message,karma_sort[i] + "+ " + name);
		}

	});

};

// !karma [user] command
// Show karma of a user
var karmaHandlerGet = function(nick, to, text, message) {
	client.hkeys("hackzog-karma", function(err,object) {
		var accepted_names = object.concat(Object.keys(bot.names()));
		var names = text.split(" ").remove("!karma");
		for(var i=0; i<names.length;i++) {

			name = names[i].replace(/\:+/g, '').replace(/\ +/g, '');
			if(!name || name.length === 0)
				break;
			if(accepted_names.indexOf(name) == -1) {
				bot.respond(message, "No user " + name + " in here!");
				break;
			}

			client.hget("hackzog-karma", name, function(err, object) {
				karma = object;
				bot.respond(message, name + " has " + karma + " karma!");
			});
		}
	});
};

module.exports = {
	register: function(b, h) {
		bot = b;
    http = h;
    http.post('/karma', function(req, res) {
      var data = req.body;
      var from = data.from;
      var to = data.to;
      client.hkeys("hackzog-karma", function(err,object) {
        var accepted_names = object.concat(Object.keys(bot.names()));
        var names = text.split(" ").remove("!karma");
        for(var i=0; i<names.length;i++) {
          name = names[i].replace(/\:+/g, '').replace(/\ +/g, '');
          if(!name || name.length === 0)
            break;
          if(accepted_names.indexOf(name) == -1) {
            break;
          }
          client.hget("hackzog-karma", name, function(err, object) {
            karma = object;
            res.send(name + " has " + karma + " karma!");
          });
        }
      });
    });

		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("+1") == -1) {
				return false;
			}
			if(!/(^|\s)\+1/g.test(text)) {
				return false;
			}
			return true;
		}, karmaHandlerIncrement);
		bot.addMessageAction(function(nick, to, text, message){
			if(text!="!top")
				return false;
			return true;
		}, karmaHandlerTop);
		bot.addMessageAction(function(nick, to, text, message){
			if(text.indexOf("!karma") == -1)
				return false;
			return true;
		}, karmaHandlerGet);


	},
	help: [
		['!karma USER', 'show karma of NICK'],
		['!top', 'show karma top users'],
		['NICK +1', 'give NICK karma'],
	],
};
