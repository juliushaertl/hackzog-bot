var bot = require("./bot");

bot.config = require('./config');
bot.connect();
bot.loadPlugins(['karma','in','topic','countdown']);
