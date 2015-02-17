var config = require("./config");

module.exports = {
	findReturnPath: function (message) {

		var return_path = message['args'][0];
		if(return_path == config.user)
			return_path = message['nick'];

		return return_path;

	}
};

Array.prototype.remove = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};


