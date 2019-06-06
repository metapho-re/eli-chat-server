/* eslint-disable no-unused-vars */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

const app = express();

mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));

app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.status(err.status || 500);
    res.statusMessage = err.message;
    res.end();
});

module.exports = app;
