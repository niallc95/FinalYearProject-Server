var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReceiptSchema = new Schema({
    email: String,
    date: String,
    time: String,
    totalCost: String,
    items: [{
            productName: String,
            productPrice: String
        }]
    });
module.exports = mongoose.model('receipt', ReceiptSchema);
