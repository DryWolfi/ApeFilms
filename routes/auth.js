const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const fs = require('fs');
const config = require('../config');

const router = express.Router();

const User = require("../models/user");

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
    function (username, password, done) {
        let hash = sha512(password, serverSalt).passwordHash;
        User.getUserByLoginAndPasshash(username, hash)
            .then(user => {
                done(user ? null : 'No user', user);
            });
    }
));
passport.use(new BasicStrategy(
    function(username, password, done) {
        let hash = sha512(password, serverSalt).passwordHash;
        User.getUserByLoginAndPasshash(username, hash)
        .then(user => {
            done(user ? null : 'No user', user);
        });
    }
  ));
  

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getById(id).then(user => {
        done(user ? null : 'No user', user);
});
});

router.get('/login', checkUnAuth, (req, res) => {
    res.render('login');
});

router.post('/login',
    passport.authenticate('local', {
         successRedirect: '/',
        failureRedirect: '/auth/login'
}));

router.get('/logout', 
(req, res) => {
    req.logout();   
    res.redirect('/');
});


router.get('/register', checkUnAuth, (req, res) => {
    res.render('register', { 
            user: req.user,
            error: req.query.error
         });
});

router.post('/register',
(req, res) => {
    let login = req.body.login;
    let fullname = req.body.fullname;
    let pass = req.body.pass;
    let pass2 = req.body.pass2;
    let password = sha512(pass, serverSalt).passwordHash;
    if(pass != pass2) res.redirect("/auth/register?error=Passwords+dont+match");
    else {
        User.getUserByLoginAndPasshash(login, password)
        .then(user => {
            if (!user){
                fs.writeFile("./public/images/users/" + req.files.avatar.name, Buffer.from(new Uint8Array(req.files.avatar.data)), 
                (err) => {
                    if (err) next(err);
                });
                User.insert(new User(null, login, 0, fullname, "../images/users/" + req.files.avatar.name, 
                  sha512(pass, serverSalt).passwordHash))
                    .then(() => res.redirect("/"))
                    .catch(err => res.status(500).send(err.toString()));
            } else {
                res.redirect("/auth/register?error=Username+already+exists");
            }
        })
        .catch(err => res.status(500).send(err.toString()));
    } 
});

function checkUnAuth(req, res, next) {
    if (!req.user) next(); 
    else return res.sendStatus(403); 
}

function checkAuth(req, res, next) {
    if (!req.user) return res.redirect("/err?err=unaut"); 
    next();  
}

function checkAdmin(req, res, next) {
    if (!req.user) res.redirect("/err?err=unaut"); 
    else if (req.user.role !== 1) res.sendStatus(403); 
    else next();  
}

const serverSalt = config.serverSalt;

function sha512(password, salt){
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

module.exports = router;