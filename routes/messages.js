const express = require('express');
const User = require('../models/user');
const Message = require('../models/message');
const authenticate = require('../authenticate/authenticate');

const router = express.Router();

router.post('/', authenticate.verifyUser, (req, res, next) => {
    const promises = req.body.chats.map((chatId) => {
        const messages = Message.find({ chatId }).limit(50).exec();
        return messages;
    });
    Promise.all(promises)
        .then((messages) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(messages);
        })
        .catch(err => next(err));
});

router.post('/newchat', authenticate.verifyUser, (req, res, next) => {
    const promises = req.body.usernames.map((username) => {
        const user = User.findOneAndUpdate(
            { username },
            { $push: { chats: req.body.chatId } },
        ).exec();
        return user;
    });
    Promise.all(promises)
        .then(() => {
            res.statusCode = 200;
            res.end();
        })
        .catch(err => next(err));
});

module.exports = router;
