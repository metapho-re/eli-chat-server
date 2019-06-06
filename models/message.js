const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema;
const Message = new MessageSchema({
    chatId: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Message', Message);
