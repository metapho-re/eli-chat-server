const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema;
const User = new UserSchema({
    socketId: {
        type: String,
    },
    chats: [{
        type: String,
    }],
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
