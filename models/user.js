const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true },
    role: { type: Number, default: 0 },
    fullname: { type: String },
    registeredAt: { type: Date, default: Date.now },
    avaUrl: { type: String },
    password: { type: String },
    whish: { type: Array },
});

const UserModel = mongoose.model('User', UserSchema);

class User{
    constructor(id, login, role, fullname, avaUrl, password) {
        this.id = id;
        this.login = login;
        this.role = role;
        this.fullname = fullname;
        this.avaUrl = avaUrl;
        this.password = password;
    }

    static getById(id){
        return UserModel.findById(id);
    }

    static getAll() {
        return UserModel.find();
    }

    static insert(user){
        return new UserModel(user).save();
    }

    static delete(userId) {
        return UserModel.deleteOne({ _id: userId });
    }

    static getUserByLoginAndPasshash(login, passHash) {
        return UserModel.findOne(
            {
              $or: [
                     { "password" : passHash },
                     { "login": login }
                   ]
            }
         );
    }

    static addFilm(film, userId) {
        return UserModel.updateOne( { _id: userId } , { $push: { whish: film }} );
    }

    static deleteFilm(name, userId) {
        return UserModel.updateOne( { _id: userId } , { $pull: { whish: { name: name }}} );
    }

    static makeAdmin(id){
        return UserModel.updateOne({_id: id}, {$set: {role : 1}});
    }

    static changeName(id, name){
        return UserModel.updateOne({_id: id}, {$set: {fullname : name}});
    }

    static changeAva(id, avatar){
        return UserModel.updateOne({_id: id}, {$set: {avaUrl : avatar}});
    }

    static find(login) {
        return UserModel.find({ login: {$regex: login} }); 
    }
}

module.exports = User;