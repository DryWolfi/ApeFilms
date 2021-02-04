const express = require('express');
const cloudinary = require('cloudinary');

const router = express.Router();

const Film = require("../models/film");
const Comment = require("../models/comment");

router.get('', (req, res) => {
    Film.getAll()
    .then(films => {
        let pages = [];
        let j = 1;
        for(let i = 0; i < films.length; i = i + 4){
            pages.push(j);
            j++;
        }
        let need = [];
        let page = parseInt(req.query.page);
        need = films.slice(4 * page - 4, 4 * page);
        res.render('films', {
            films: need,
            page: page,
            pages: pages,
            user: req.user
    })})
    .catch(err => res.status(500).send(err.toString()));
});

router.get('/:id',
checkAuth, (req, res, next) => {
    const filmId = req.params.id;
    const id = parseInt(filmId);
    Film.getById(filmId)
        .then(film => {
            if (film === null){
                res.status(404).send("Sorry, not found that film");
            } else {
                res.render("film", {
                    film: film,
                    comments: film.comments,
                    user: req.user
                });
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});

router.post('/:id',
checkAdmin, (req, res) => {
    let idStr = req.params.id;
    const id = parseInt(idStr);
    Film.delete(idStr)
    .then(films => res.redirect("/films?page=1"))
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/video/:id', function handleFileUpload(req, res) {
    const fileObject = req.files.video;
    const fileBuffer = fileObject.data;
    cloudinary.v2.uploader.upload_stream({ resource_type: 'video' },
        function (error, result) { 
            Film.addVideo(req.params.id, result.url)
            .then(() => {
                    res.redirect(`/films/${req.params.id}`);
            })
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