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
var ansid=0;


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


app.post("/api/questions/rating/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        console.log(id);
        const rating = req.body.rating;
        const question = await Question.findOne({questionId:id});
        const answer = await Answer.findOne({})
        if(!question){
            res.status(404).json({"message":"Question doesnt exist"});
        }
    if (rating === "Up") {
        question.upvotes += 1;
      } else {
        question.downvotes += 1;
      }
  
      await question.save();
        res.status(201).json({message:"Successfully changed rating"}) ;
    } catch (error) {
     console.error(error);   
    }
    
});

app.post("/api/questions/comment/:id",async(req,res)=>{

    try {
        const id = req.params.id;
        const comment = req.body.comment;
        const question = await Question.findOne({questionId:id});
        if(!question){
            res.status(404).json({"message":"Question doesnt exist"});
        } 
        if(!comment){
            res.status(404).json({"message":"Please provide a comment to post"});
        }
        question.comments.push(comment);
        await question.save();
        res.status(201).json({"message":"Successfully posted comment"});
    } catch (error) {
        console.error(error);
    }
    
    
})
app.post("/api/questions/create", async (req, res) => {
    try {
      const question = await Question.create({
        questionId:counter,
        questionText: req.body.question,
      });
      const answer = await Answer.create({
        question: question._id,
        id:ansid, 
        answerText: req.body.answer, 
      });
      console.log(question);
      console.log(answer);
      counter++;
      ansid++;
      res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the question' });
    }
  });
 
  app.patch("/api/questions/update/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updatedQuestionText = req.body.questionText;
  
      const question = await Question.findOne({ questionId: id });
  
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      question.questionText = updatedQuestionText;
      await question.save();
  
      res.status(200).json({ message: "Question updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while updating the question" });
    }
  });
  




app.listen(3000,()=>{console.log("Server started at 3000")})