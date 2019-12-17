const express = require('express');

const Users = require('./user-model');

const router = express.Router();

const bcrypt = require('bcryptjs');

// Middleware

function restricted(req, res, next) {
    // we'll read the username and password from headers
    // the client is responsible for setting those headers
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Please login first.' });
    }
} 


// CRUD

router.post('/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);

    user.password = hash;
    
    Users.registerUser(req.body)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'Failed to register.' });
        });
});

router.post('/login', (req,res)=>{
    let { username, password } = req.body;

    Users.getUserBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;

                // in here with .compare()
                // change the users-model findBy() to return the password as well
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/users', restricted, (req, res)=>{
    Users.getUsers()
        .first()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to get users.' });
        });
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy( err => {
            if(err) {
            res.status(500).json({ error: 'error deleting the session' })
            } else {
            res.status(200).json({ message: 'logged out' });
            }
    });
    } else {
        res.status(200).end();
    }
})


module.exports = router;