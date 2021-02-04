const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: Object },
});

const CommentModel = mongoose.model('Comment', CommentSchema);

class Comment{
    constructor(text, user) {
        this.text = text;
        this.user = user;
    }

    static find(text) {
        return CommentModel.findOne({ text: text }); 
    }

    static getAll() {
        return CommentModel.find(); 
    }

    static insert(comment) {
        return new CommentModel(comment).save();; 
    }

    static delete(Id) {
        return CommentModel.deleteOne({ _id: Id });
    }

}

module.exports = Comment;

