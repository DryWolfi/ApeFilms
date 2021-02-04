const express = require('express');
const fs = require('fs');
const cloudinary = require('cloudinary');

const router = express.Router();

const User = require("../models/user");

router.get('',
checkAdmin, (req, res) => {
    User.getAll()
        .then(users => res.render("users", {
            users: users,
            user: req.user
        }))
        .catch(err => res.status(500).send(err.toString()));
});

router.get('/settings',
checkAuth, (req, res) => {
    res.render("settings", {
        user: req.user
    });
});

router.get('/:id',
checkAuth, (req, res) => {
    const userId = req.params.id;
    User.getById(userId)
        .then(user => {
            if (typeof user === "undefiend"){
                res.status(404).send("Sorry, not found that user");
            } else {
                res.render("user", {
                    us: user,
                    user: req.user
                });
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});

router.post('/:id',
checkAdmin, (req, res) => {
    let idStr = req.params.id;
    User.delete(idStr)
    .then(films => res.redirect("/users"))
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/fullname/:id',
checkAuth, (req, res) => {
    User.changeName(req.params.id, req.body.fullname)
    .then(() => {
            res.redirect("/");
    })
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/ava/:id', function handleFileUpload(req, res) {
    const fileObject = req.files.avatar;
    const fileBuffer = fileObject.data;
    cloudinary.v2.uploader.upload_stream({ resource_type: 'image' },
        function (error, result) { 
            User.changeAva(req.params.id, result.url)
            .then(() => {
                    res.redirect(`/users/${req.params.id}`);
            })
            .catch(err => res.status(500).send(err.toString()));
        })
        .end(fileBuffer);
});

/*router.post('/ava/:id',
checkAuth, (req, res) => {
    fs.writeFile("./public/images/users/" + req.files.avatar.name, Buffer.from(new Uint8Array(req.files.avatar.data)), 
    (err) => {
        if (err) next(err);
    });
    User.changeAva(req.params.id, "../images/users/" + req.files.avatar.name)
    .then(() => {
            res.redirect("/");
    })
    .catch(err => res.status(500).send(err.toString()));
});*/

router.post('/admin/:id',
checkAdmin, (req, res) => {
    let idStr = req.params.id;
    const id = parseInt(idStr);
    User.makeAdmin(idStr)
    .then(films => res.redirect("/users"))
    .catch(err => res.status(500).send(err.toString()));
});

function checkAuth(req, res, next) {
    if (!req.user) return res.redirect("/err?err=unaut");
    next();  
}
function checkAdmin(req, res, next) {
    if (!req.user) return res.redirect("/err?err=unaut");
    else if (req.user.role !== 1) return res.redirect("/err?err=forb");
    else next(); 
}

module.exports = router;