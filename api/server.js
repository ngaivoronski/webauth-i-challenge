const express = require('express');

const userRouter = require('./user-router');
const restrictedMiddleware = require('./restricted-middleware');
const configureMiddleware = require('./configure-middleware.js');

const server = express();



configureMiddleware(server);

server.use('/api', userRouter);
server.use('/api/restricted', restrictedMiddleware, userRouter);


module.exports = server;
