const express = require('express');

const router = express.Router();

const Actor = require("../models/actor");
const Film = require("../models/film");

router.get('', (req, res) => {
    Actor.getAll()
    .then(actors => {
        let pages = [];
        let j = 1;
        for(let i = 0; i < actors.length; i = i + 6){
            pages.push(j);
            j++;
        }
        let need = [];
        let page = parseInt(req.query.page);
        need = actors.slice(6 * page - 6, 3 * page);
        need2 = actors.slice(6 * page - 3, 6 * page)
        res.render('actors', {
            actors: need,
            actors2: need2,
            page: page,
            pages: pages,
            user: req.user
    })})
    .catch(err => res.status(500).send(err.toString()));
});

router.get('/:id',
checkAuth, (req, res, next) => {
    const actorId = req.params.id;
    Actor.getById(actorId)
        .then(actor => {
            res.render('actor', {
                actor: actor,
                user: req.user
        })})
        .catch(err => res.status(500).send(err.toString()));
});

router.post('/:id',
checkAdmin, (req, res, next) => {
    let idStr = req.params.id;
    Actor.getById(idStr)
    .then(actor => {
        Film.getAll()
        .then(films => {
            let nothave = [];
            let check = 0;
            for(let i = 0; i < films.length; i++){
                for(let j = 0; j < actor.films.length; j++){
                    if(actor.films[j].name != films[i].name){
                        check++;
                    }
                }
                if(check == actor.films.length){
                    nothave.push(films[i]);
                }
                check = 0;
            }
            res.render("addf", {
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