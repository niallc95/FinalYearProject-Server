var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema = new Schema({
    productName: String,
    productPrice: String,
    productCategory: String,
    scanContent: String
});

module.exports = mongoose.model('item', ItemSchema);
