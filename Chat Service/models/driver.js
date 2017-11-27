const mongoose = require('mongoose');

// Schema user finding order
var findingOrderSchema = mongoose.Schema({
  username: String,
});

const findingOrder = module.exports = mongoose.model('findingOrder', findingOrderSchema);