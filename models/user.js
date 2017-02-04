var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	name: String,
	email: String,
	phoneNumber: String,
	password: String,
	date:String,
	credit: Number,
	orders:Number
});

module.exports = mongoose.model('User', UserSchema);
