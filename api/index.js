const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const cors=require('cors');
const User = require("./models/user");
const Question = require("./models/questions");
const Answer  = require("./models/answers");
const app  =express()

//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://khadayatesahil:sahil123@cluster0.v5xgni0.mongodb.net/shipmnt?retryWrites=true&w=majority";
async function connect(){
    try {
        const db = await mongoose.connect(uri,{useNewUrlParser: true,
            useUnifiedTopology: true});
        console.log("Connected");
        return db;
    } catch (error) {
        console.error(error);
    }
}

const db = connect();

var counter=0;



app.post("/api/users",async(req,res)=>{
    
    try {
        const user = await User.create({
            name: req.body.name,
            password: req.body.password,
            email:req.body.email,
          });
          console.log(user);
          res.end();
    } catch (error) {
        console.error(error);
    }
   

    // var name = req.body.name;
    // var name = req.body.name
});



app.get("/api/questions", async (req, res) => {
    try {
      const questions = await Question.find({});

      res.json(questions);
    
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching questions.' });
    }
  });


app.post("api/questions/:id/rating",async(req,res)=>{
    const id = req.params.id;
    const rating = req.body.rating;
    const question = await Question.findOne({questionId:id});
    if(rating==="Up"){
        question.updateOne({upvotes:upvotes+1})
    }
    else{
        question.updateOne({downvotes:downvotes+1})
    }
});

app.post("/api/questions/create", async (req, res) => {
    try {
      const question = await Question.create({
        questionId:counter,
        questionText: req.body.question,
      });
      const answer = await Answer.create({
        question: question._id, 
        answerText: req.body.answer, 
      });
      console.log(question);
      console.log(answer);
      counter++;
      res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the question' });
    }
  });




app.listen(3000,()=>{console.log("Server started at 3000")})