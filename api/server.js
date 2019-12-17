const express = require('express');

const userRouter = require('./user-router');
const configureMiddleware = require('./configure-middleware.js');

const server = express();

configureMiddleware(server);

server.use('/api', userRouter);

module.exports = server;
