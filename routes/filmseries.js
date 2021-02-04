const express = require('express');

const router = express.Router();

const FilmSerie = require("../models/film_serie");
const Film = require("../models/film");

router.get('', (req, res) => {
    FilmSerie.getAll()
    .then(filmseries => {
        res.render("filmseries", {
        filmseries: filmseries,
        user: req.user
    })})
    .catch(err => res.status(500).send(err.toString()));
});

router.get('/:id',
checkAuth, (req, res, next) => {
    const filmserieId = req.params.id;
    FilmSerie.getById(filmserieId)
        .then(filmserie => {
            let pages = [];
            let j = 1;
            for(let i = 0; i < filmserie.films.length; i = i + 3){
                pages.push(j);
                j++;
            }
            let need = [];
            let page = parseInt(req.query.page);
            need = filmserie.films.slice(3 * page - 3, 3 * page);
            res.render('filmserie', {
                filmserie: filmserie,
                films: need,
                page: page,
                pages: pages,
                user: req.user
        })})
        .catch(err => res.status(500).send(err.toString()));
});

router.post('/:id',
checkAdmin, (req, res, next) => {
    let idStr = req.params.id;
    FilmSerie.getById(idStr)
    .then(filmserie => {
        Film.getAll()
        .then(films => {
            let nothave = [];
            let check = 0;
            for(let i = 0; i < films.length; i++){
                for(let j = 0; j < filmserie.films.length; j++){
                    if(filmserie.films[j].name != films[i].name){
                        check++;
                    }
                }
                if(check == filmserie.films.length){
                    nothave.push(films[i]);
                }
                check = 0;
            }
            res.render("add", {
            films: nothave,
            Id: idStr,
            user: req.user
        })})
        .catch(err => res.status(500).send(err.toString()));
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