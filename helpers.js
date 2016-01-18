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

String.prototype.pad = function(pad_char, pad_length, pad_right) {
	var result = this;
	if( (typeof pad_char === 'string') && (pad_char.length === 1) && (pad_length > this.length) )
	{
		var padding = new Array(pad_length - this.length + 1).join(pad_char);
		result = (pad_right ? result + padding : padding + result);
	}
	return result;
}
