/* eslint-disable no-underscore-dangle */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractToken = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const opts = {};
opts.jwtFromRequest = ExtractToken.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload._id }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        return done(null, false);
    });
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });
exports.getToken = user => jwt.sign(user, config.secretKey);
exports.verifyToken = token => jwt.verify(token, config.secretKey);
