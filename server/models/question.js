//Setup datbase
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var QuestionSchema = new mongoose.Schema({
    question: String,
    description: String,
    answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    created_at: {type: Date, default: new Date().toString()}
})
var Question = mongoose.model('Question', QuestionSchema);