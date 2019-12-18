const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions); // to store sessions in the database
const knex = require('../data/dbConfig');

const sessionConfiguration = {
    // session storage options
    name: 'cookie crips', // default would be sid
    secret: 'keep it secret, keep it safe!', // used for encryption (must be an environment variable)
    saveUninitialized: true, // has implications with GDPR laws
    resave: false,

    // how to store the sessions
    store: new KnexSessionStore({ // do not forget the NEW keyword
        knex, // imported from dbConfig.js

        // optional
        createtable: true,
        clearInterval: 1000 * 60 * 10,
        sidfieldname: 'sid',

        // optional
        tablename: 'sessions',
    }),

    // cookie options
    cookie: {
        maxAge: 1000 * 60 * 10, // 10 minutes in milliseconds
        secure: false, //if false, the cookie is sent over http, if true only sent over https
        httpOnly: true, // if true, javascript cannot access the cookie
    }
}

module.exports = server => {
    server.use(helmet());
    server.use(express.json());
    server.use(cors());
    server.use(sessions(sessionConfiguration)); // add a req.session object
};
