const User = require("./models/user");
const Film = require("./models/film");
const FilmSerie = require("./models/film_serie");
const Comment = require("./models/comment");
const Actor = require("./models/actor");
const fs = require('fs');
const express = require('express');
const app = express();
const consolidate = require('consolidate');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const multer = require('multer')
const mongoose = require('mongoose');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const auth = require('basic-auth')
const config = require('./config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});


const databaseUrl = config.DatabaseUrl;
const connectOptions = { useNewUrlParser: true };
const PORT = config.ServerPort;
mongoose.connect(databaseUrl, connectOptions)
    .then(() => console.log(`Database connected: ${databaseUrl}`))
    .then(() => app.listen(PORT, () => console.log('server is listening at %s', PORT)))
    .catch(err => console.log(`Start error: ${err}`));

const viewDir = path.join(__dirname, 'views');
app.set('views', viewDir);
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
	secret: "Some_secret^string",
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const usersRouter = require('./routes/users');
app.use("/users", usersRouter);
const filmsRouter = require('./routes/films');
app.use("/films", filmsRouter);
const actorRouter = require('./routes/actors');
app.use("/actors", actorRouter);
const filmseriesRouter = require('./routes/filmseries');
app.use("/filmseries", filmseriesRouter);
const authRouter = require('./routes/auth');
app.use("/auth", authRouter);
const developerRouter = require('./routes/developer');
app.use("/developer", developerRouter);
const apiRouter = require('./routes/api');
app.use("/api", apiRouter);
const addRouter = require('./routes/add');
app.use("/add", addRouter);
const delRouter = require('./routes/del');
app.use("/del", delRouter);
const newRouter = require('./routes/new');
app.use("/new", newRouter);

app.use(express.static('public'));

app.get('/',
(req, res) => {
    res.render('index', { user: req.user })
});

app.post('/filmserie/:id', function (req, res, next) {
    let idStr = req.params.id;
    let filmId = idStr.slice(0, 24);
    let felmseriesId = idStr.slice(24, 48);
    Film.getById(filmId)
        .then(film => {
            FilmSerie.deleteFilm(film, felmseriesId)
                .then(filmserie => {
                    res.redirect("../filmseries")
                })
                .catch(err => res.status(500).send(err.toString()));
        })
        .catch(err => res.status(500).send(err.toString()));

});

app.post('/comment/:id', checkAuth, (req, res, next) => {
    res.render('newcom', { 
        user: req.user,
        filmId: req.params.id
    });
});

app.post('/act/:id',
checkAdmin, (req, res, next) => {
    let idStr = req.params.id;
    Film.getById(idStr)
    .then(film => {
        Actor.getAll()
        .then(actors => {
            let nothave = [];
            let check = 0;
            for(let i = 0; i < actors.length; i++){
                for(let j = 0; j < film.actors.length; j++){
                    if(film.actors[j].name != actors[i].name){
                        check++;
                    }
                }
                if(check == film.actors.length){
                    nothave.push(actors[i]);
                }
                check = 0;
            }
            res.render("adda", {
            actors: nothave,
            Id: idStr,
            user: req.user
        })})
        .catch(err => res.status(500).send(err.toString()));
    })
    .catch(err => res.status(500).send(err.toString()));
});

app.get('/search', function (req, res, next) {
    let text = req.query.text;
    Film.find(text)
        .then(films => {
            if (films.length == 0) {
                res.status(404).redirect("/err?err=found.jpg");
            } else {
                res.render("search", {
                    films: films,
                    results: films.length,
                    search: text,
                    user: req.user
                });
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});

app.get('/about', function (req, res) {
    res.render('about', { user: req.user });
});

app.get('/err', (req, res) => {
    res.render('err', { 
            user: req.user,
            err: req.query.err
        });
});

app.use(function (req, res, next) {
    return res.status(404).redirect("/err?err=404.png");
})

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

function checkUnAuth(req, res, next) {
    if (!req.user) next(); 
    else return res.sendStatus(403); 
}

function checkAuth(req, res, next) {
    if (!req.user) return res.redirect("/err?err=unaut.png");
    next();  
}

function checkAdmin(req, res, next) {
    if (!req.user) res.redirect("/err?err=unaut.png"); 
    else if (req.user.role !== 1) return res.redirect("/err?err=forb.png");
    else next();  
}





