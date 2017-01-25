var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	name: String,
	email: String,
	phoneNumber: String,
	password: String,
	address: String,
	credit: double
});

module.exports = mongoose.model('User', UserSchema);
