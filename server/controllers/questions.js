//Setup
var mongoose = require('mongoose');
var Question = mongoose.model('Question');
var Answer = mongoose.model('Answer');

//export module
module.exports = {
    retrieve: function(req, res) {
        Question.find({}, function(err, questions) {
            if (err) {
                res.json({type: false, errors: err});
            } else {
                res.json({type: true, questions: questions});   
            }
        })
    },
    retrieveOne: function(req, res) {
        Question.findOne({_id: req.params.id}).populate('answers').exec(function(err, question) {
            if (err) {
                res.json({type: false, errors: err});
            } else {
                res.json({type: true, question: question});   
            }
        })
    },
    create: function(req, res) {
        var question = new Question({question: req.body.question, description: req.body.description});
        question.save(function(err) {
            if (err) {
                console.log(err);
                res.json({type: false, errors: err})
            } else {
                res.json({type: true});
            }
        })
    },
    answer: function(req, res){
        Question.findOne({_id: req.params.id}, function(err, question){
            var answer = new Answer({answer: req.body.answer, details: req.body.details, user: req.body.user, _question: question._id, likes: 0})
            question.answers.push(answer);
            answer.save(function(err, answer){
                question.save(function(err){
                    if (err) {
                        console.log(err);
                        res.json({type: false, errors: err});
                    } else {
                        res.json({type: true});
                    }
                })     
            })
        })
    },
    like_answer: function(req, res){
        Answer.findByIdAndUpdate(req.params.id, {$inc: {likes: 1}}, function(err, answer){
            Question.findOne({_id: answer._question}).populate('answers').exec(function(err, question){
                if (err) {
                    console.log(err);
                    res.json({type: false, errors: err})
                } else {
                    res.json({type: true, question: question});
                }
            })
        })
    }
}