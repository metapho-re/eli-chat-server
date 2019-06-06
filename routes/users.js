/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

const express = require('express');
const passport = require('passport');
const authenticate = require('../authenticate/authenticate');
const User = require('../models/user');

const router = express.Router();

router.get('/', authenticate.verifyUser, (req, res, next) => {
    User.find({}).exec()
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        })
        .catch(err => next(err));
});

router.post('/signup', (req, res, next) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) return next(err);
        user.socketId = req.body.socketId;
        user.save()
            .then(() => {
                const token = authenticate.getToken({ _id: user._id });
                const response = {
                    token,
                    username: req.body.username,
                    socketId: req.body.socketId,
                };
                res.statusCode = 200;
                res.json(response);
            })
            .catch(error => next(error));
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err) return next(err);
        if (!user) {
            const error = new Error('Something went wrong. Please try again');
            return next(error);
        }
        user.socketId = req.body.socketId;
        user.save()
            .then(() => {
                const token = authenticate.getToken({ _id: user._id });
                const response = {
                    token,
                    username: req.body.username,
                    socketId: req.body.socketId,
                    chats: user.chats,
                };
                res.statusCode = 200;
                res.json(response);
            })
            .catch(error => next(error));
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    let decoded = {};
    try {
        const authHeader = req.headers.authorization;
        decoded = authenticate.verifyToken(authHeader.substring(7, authHeader.length));
        User.findByIdAndUpdate(decoded._id, { socketId: '' }, { runValidators: true }).exec()
            .then((user) => {
                const response = {
                    username: user.username,
                    chats: user.chats,
                };
                res.statusCode = 200;
                res.json(response);
            })
            .catch(err => next(err));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
