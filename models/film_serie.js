const mongoose = require('mongoose');

const FilmSeriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genre: { type: String },
    films: { type: Array },
    amount: { type: Number },
});

const FilmSeriesModel = mongoose.model('FilmSeries', FilmSeriesSchema);

class FilmSeries{
    constructor(name, genre, films, amount) {
        this.name = name;
        this.genre = genre;
        this.films = films;
        this.amount = amount; 
    }

    static getById(id){
        return FilmSeriesModel.findById(id);
    }

    static getAll() {
        return FilmSeriesModel.find(); 
    }

    static deleteFilm(film, felmseriesId) {
        return FilmSeriesModel.updateOne( { _id: felmseriesId } , { $pull: {films: film}, $inc : { amount: -1 }} );
    }

    static addFilm(film, felmseriesId) {
        return FilmSeriesModel.updateOne( { _id: felmseriesId } , { $push: { films: film }, $inc : { amount: 1 }} );
    }

    static find(name) {
        return FilmSeriesModel.findOne({ name: {$regex: name} }); 
    }
}

module.exports = FilmSeries;