const User = require("../models/user");
const Film = require("../models/film");
const FilmSerie = require("../models/film_serie");
const Comment = require("../models/comment");
const Actor = require("../models/actor");
const express = require('express');

const router = express.Router();

router.post('/film/:id', function (req, res, next) {
    let idStr = req.params.id;
    let filmId = idStr.slice(0, 24);
    let actorId = idStr.slice(24, 48);
    Film.getById(filmId)
    .then(film => {
        Actor.addFilm(film, actorId)
            .then(resoult => {
                res.redirect(`/actors/${actorId}`)
            })
            .catch(err => res.status(500).send(err.toString()));
    })
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/actor/:id', function (req, res, next) {
    let idStr = req.params.id;
    let actorId = idStr.slice(0, 24);
    let filmId = idStr.slice(24, 48);
    Actor.getById(actorId)
    .then(actor => {
        Film.addActor(actor, filmId)
            .then(resoult => {
                res.redirect(`/films/${filmId}`)
            })
            .catch(err => res.status(500).send(err.toString()));
    })
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/:id', function (req, res, next) {
    let idStr = req.params.id;
    let filmId = idStr.slice(0, 24);
    let felmseriesId = idStr.slice(24, 48);
    FilmSerie.getById(felmseriesId)
        .then(filmserie => {
            Film.getById(filmId)
                .then(film => {
                    FilmSerie.addFilm(film, felmseriesId)
                        .then(resoult => {
                            res.redirect("../filmseries")
                        })
                        .catch(err => res.status(500).send(err.toString()));
                })
                .catch(err => res.status(500).send(err.toString()));

        })
        .catch(err => res.status(500).send(err.toString()));

});

router.post('/wish/:id', function (req, res, next) {
    let filmId = req.params.id;
    Film.getById(filmId)
    .then(film => {
        User.addFilm(film, req.user.id)
        .then(resoult => {
            res.redirect(`/films/${filmId}`)})
        .catch(err => res.status(500).send(err.toString()));
    })
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/com/:id', checkAuth, (req, res, next) => {
    Film.addComment(new Comment(req.body.comment, req.user), req.params.id)
        .then(() => {
            res.redirect(`/films/${req.params.id}`)
            })
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