const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const crypto = require('crypto');
const config = require('../config');

const User = require("../models/user");
const Film = require("../models/film");
const FilmSerie = require("../models/film_serie");

const router = express.Router();

router.get('/v1', 
passport.authenticate('basic', { session: false }), (req, res) => {
    res.set("Content-type", "application/json").send();
});

router.get('/v1/me', 
passport.authenticate('basic', { session: false }), (req, res) => {
    res.set("Content-type", "application/json").send(req.user);
});

router.get('/v1/users', 
passport.authenticate('basic', { session: false }), (req, res) => {
    User.getAll()
    .then(users => {
        if(req.query.search == undefined) res.json(users);
        if (req.query.search != undefined){;
            User.find(req.query.search)
            .then(user => {
                if (typeof user === "undefiend"){
                    res.status(404).redirect("/err?err=404");
                } else {
                    res.json(user);
                }
            })
            .catch(err => res.status(500).send(err.toString())); 
        }
        else res.json(users)})
    .catch(err => res.status(500).send(err.toString()));
});

router.get('/v1/users/:id',
passport.authenticate('basic', { session: false }), (req, res) => {
    const userId = req.params.id;
    User.getById(userId)
        .then(user => {
            if (typeof user === "undefiend"){
                res.status(404).send("Sorry, not found that user");
            } else {
                res.json(user);
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});

router.get('/v1/films', 
passport.authenticate('basic', { session: false }), (req, res) => {
    Film.getAll()
    .then(films => {
        if(req.query.page == undefined && req.query.search == undefined) res.json(films);
        if (req.query.search != undefined){
            Film.find(req.query.search)
            .then(film => {
                if (typeof film === "undefiend"){
                    res.status(404).redirect("/err?err=404");
                } else {
                    res.json(film);
                }
            })
            .catch(err => res.status(500).send(err.toString())); 
        }
        else {
            let pages = [];
            let j = 1;
            for(let i = 0; i < films.length; i = i + 5){
                pages.push(j);
                j++;
            }
            let need = [];
            let page = parseInt(req.query.page);
            if (page == 1) need = films.slice(0, 2);
            if (page != 1) need = films.slice(2*(page - 1), 2*page);
            res.json(need)}})
    .catch(err => res.status(500).send(err.toString()));
});

router.get('/v1/films/:id',
passport.authenticate('basic', { session: false }), (req, res) => {
    const filmId = req.params.id;
    Film.getById(filmId)
        .then(film => {
            if (typeof film === "undefiend"){
                res.status(404).redirect("/err?err=404");
            } else {
                res.json(film);
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});

router.get('/v1/filseries', 
passport.authenticate('basic', { session: false }), (req, res) => {
    FilmSerie.getAll()
    .then(filserie => res.json(filserie))
    .catch(err => res.status(500).send(err.toString()));
});

router.get('/v1/filmseries/:id',
passport.authenticate('basic', { session: false }), (req, res) => {
    const filmserieId = req.params.id;
    FilmSerie.getById(filmserieId)
        .then(filmserie => {
            let pages = [];
            let j = 1;
            for(let i = 0; i < filmserie.films.length; i = i + 2){
                pages.push(j);
                j++;
            }
            let need = [];
            let page = parseInt(req.query.page);
            if (page == 1) need = filmserie.films.slice(0, 2);
            if (page != 1) need = filmserie.films.slice(2*(page - 1), 2*page);
            res.json(need)})
        .catch(err => res.status(500).send(err.toString()));
});

module.exports = router;