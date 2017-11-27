const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender_name: {
        type: String,
        required: true
    },
    receiver_name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const Message = module.exports = mongoose.model('Message', MessageSchema);