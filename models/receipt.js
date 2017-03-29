var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReceiptSchema = new Schema({
    email: String,
    referenceNumber:String,
    itemCount:String,
    date: String,
    time: String,
    totalCost: String,
    items: [{
            productName: String,
            productPrice: String,
            productQuantity: Number
        }]
    });
module.exports = mongoose.model('receipt', ReceiptSchema);
