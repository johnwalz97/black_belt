//Variables
var questions = require("../controllers/questions.js");

//export module
module.exports = function(app){
    //Routes
    app.get("/", function(req, res){
        res.render('index');
    })
    
    //getting all questions
    app.get("/questions", function(req, res){
        questions.retrieve(req, res);
    })

    //getting one question
    app.get("/question/:id", function(req, res){
        questions.retrieveOne(req, res);
    })
    
    //creating answers
    app.post("/add_answer/:id", function(req, res){
        questions.answer(req, res);
    })
    
    //creating a question
    app.post("/questions", function(req, res){
        questions.create(req, res);
    })
    
    //updating likes
    app.get("/answer/:id/like", function(req, res){
        questions.like_answer(req, res);  
    })
}