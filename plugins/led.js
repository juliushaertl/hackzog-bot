// !led
// currently implemented in another bot
// this module is just for adding another help command
var helpers = require("../helpers");
var request = require('request');



module.exports = {
	register: function(b) {

	},
	help: [
		['!led', 'let blink the led light in the Space'],
	],
};
