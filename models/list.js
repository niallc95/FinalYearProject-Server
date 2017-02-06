var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ListSchema = new Schema({
    email: String,
    items: [{
        productName: String,
        productPrice: String
    }]
});
module.exports = mongoose.model('list', ListSchema);
