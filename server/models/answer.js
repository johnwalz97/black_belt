//Setup datbase
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AnswerSchema = new mongoose.Schema({
    answer: String,
    details: String,
    user: String,
    likes: Number,
    _question: {type: Schema.Types.ObjectId, ref: 'Post'},
    created_at: {type: Date, default: new Date()}
})
var Answer = mongoose.model('Answer', AnswerSchema);