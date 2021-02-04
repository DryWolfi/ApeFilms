const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genre: { type: String },
    creationYear: { type: Number },
    duration_min: { type: Number },
    premiere: { type: Date, default: Date.now },
    avaUrl: { type: String },
    comments: { type: Array },
    actors: { type: Array },
    videoUrl: { type: String },
});

const FilmModel = mongoose.model('Film', FilmSchema);

class Film{
    constructor(id, name, genre, creationYear, duration_min, premiere, avaUrl) {
        this.id = id;
        this.name = name;
        this.genre = genre;
        this.creationYear = creationYear;
        this.duration_min = duration_min;
        this.premiere = premiere;
        this.avaUrl = avaUrl;
    }

    static getById(id){
        return FilmModel.findById(id);
    }

    static getAll() {
        return FilmModel.find(); 
    }

    static insert(film) {
        return new FilmModel(film).save();; 
    }

    static delete(filmId) {
        return FilmModel.deleteOne({ _id: filmId });
    }

    static addComment(comment, filmId) {
        return FilmModel.updateOne( { _id: filmId } , { $push: { comments: comment }} );
    }

    static deleteComment(text, filmId) {
        return FilmModel.updateOne( { _id: filmId } , { $pull: {comments: { text: text }}} );
    }

    static addActor(actor, filmId) {
        return FilmModel.updateOne( { _id: filmId } , { $push: { actors: actor }} );
    }

    static deleteActor(name, filmId) {
        return FilmModel.updateOne( { _id: filmId } , { $pull: {actors: { name: name }}} );
    }

    static find(name) {
        return FilmModel.find({ name: {$regex: name} }); 
    }

    static addVideo(id, videoUrl){
        return FilmModel.updateOne({_id: id}, {$set: {videoUrl : videoUrl}});
    }
}

module.exports = Film;