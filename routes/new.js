const User = require("../models/user");
const Film = require("../models/film");
const FilmSerie = require("../models/film_serie");
const Comment = require("../models/comment");
const Actor = require("../models/actor");
const express = require('express');
const cloudinary = require('cloudinary');

const router = express.Router();

router.get('', function (req, res) {
    res.render('new', { user: req.user });
});

router.get('/actor', function (req, res) {
    res.render('newac', { user: req.user });
});

router.post('/actor', function handleFileUpload(req, res) {
    const fileObject = req.files.face;
    const fileBuffer = fileObject.data;
    cloudinary.v2.uploader.upload_stream({ resource_type: 'image' },
        function (error, result) { 
            Actor.insert(new Actor(null, req.body.name, result.url))
            .then(() => res.redirect("/actors?page=1"))
            .catch(err => res.status(500).send(err.toString()));
        })
        .end(fileBuffer);
});

router.post('', function handleFileUpload(req, res) {
    const fileObject = req.files.avatar;
    const fileBuffer = fileObject.data;
    cloudinary.v2.uploader.upload_stream({ resource_type: 'image' },
        function (error, result) { 
            Film.insert(new Film(null, req.body.name, req.body.genre, req.body.year, req.body.dur, req.body.data,
                result.url))
                .then(() => res.redirect("films?page=1"))
                .catch(err => res.status(500).send(err.toString()));
        })
        .end(fileBuffer);
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