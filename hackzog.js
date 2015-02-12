var bot = require("./bot");

bot.config = require('./config');
bot.connect();
bot.loadPlugins(['score','in']);
