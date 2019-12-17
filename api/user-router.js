const express = require('express');

const Users = require('./user-model');

const router = express.Router();

const bcrypt = require('bcryptjs');

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

router.get('/users', (req, res)=>{
    Users.getUsers()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to get users.' });
        });
});


module.exports = router;