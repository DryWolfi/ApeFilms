const User = require("../models/user");
const Film = require("../models/film");
const FilmSerie = require("../models/film_serie");
const Comment = require("../models/comment");
const Actor = require("../models/actor");
const express = require('express');

const router = express.Router();

router.post('/film/:id', function (req, res, next) {
    let idStr = req.params.id;
    let actorId = idStr.slice(0, 24);
    let name = idStr.slice(24);
    Actor.deleteFilm(name, actorId)
    .then(() => {
        res.redirect(`/actors/${actorId}`)
        })
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/actor/:id', function (req, res, next) {
    let idStr = req.params.id;
    Actor.delete(idStr)
    .then(films => res.redirect("/actors?page=1"))
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/wish/:id', function (req, res, next) {
    let name = req.params.id;
    User.deleteFilm(name, req.user.id)
    .then(() => {
        res.redirect(`/users/${req.user.id}`)})
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/com/:id', checkAuth, (req, res, next) => {
    let idStr = req.params.id;
    let filmId = idStr.slice(0, 24);
    let text = idStr.slice(24);
    Film.deleteComment(text, filmId)
    .then(() => {
        res.redirect(`/films/${filmId}`)})
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