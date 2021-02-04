const mongoose = require('mongoose');

const ActorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    face: { type: String },
    films: { type: Array },
});

const ActorModel = mongoose.model('Actor', ActorSchema);

class Actor{
    constructor(id, name, face) {
        this.id = id;
        this.name = name;
        this.face = face;
    }

    static getById(id){
        return ActorModel.findById(id);
    }

    static getAll() {
        return ActorModel.find();
    }

    static insert(actor){
        return new ActorModel(actor).save();
    }

    static delete(Id) {
        return ActorModel.deleteOne({ _id: Id });
    }

    static addFilm(film, actorId) {
        return ActorModel.updateOne( { _id: actorId } , { $push: { films: film }} );
    }

    static deleteFilm(name, Id) {
        return ActorModel.updateOne( { _id: Id } , { $pull: {films: { name: name }}} );
    }

    static find(name) {
        return ActorModel.find({ name: {$regex: name} }); 
    }
}

module.exports = Actor;