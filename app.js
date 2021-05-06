const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect(
  "mongodb+srv://admin_mohit:test1234@cluster0.ygnua.mongodb.net/candidateDB?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

const candidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  firstRound: Number,
  secondRound: Number,
  thirdRound: Number,
});

const Candidate = new mongoose.model("Candidate", candidateSchema);

app.get("/", (req, res) => {
  res.render("register");
});

app.get("/score", (req, res) => {
  res.render("Candidate Score");
});

app.post("/login", (req, res) => {
  const user = new Candidate({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    firstRound: 0,
    secondRound: 0,
    thirdRound: 0,
  });
  user.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully added");
    }
  });
  res.send(
    "<h1>Candidate inserted Successfull</h1><p>To submit score  <a href = 'http://localhost:3000/score'> click here</a>"
  );
  console.log(req.body.firstName);
});

app.post("/score", (req, res) => {
  const mail = req.body.candidateEmail;
  const fScore = req.body.firstScore;
  const sScore = req.body.secondScore;
  const tScore = req.body.thirdScore;
  console.log(fScore, sScore, tScore, mail);
  Candidate.updateMany(
    { email: mail },
    { firstRound: fScore, secondRound: sScore, thirdRound: tScore },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.render("register");
});

app.get("/high-score", async (req, res) => {
  const candidateDetail = [];
  await Candidate.find({}, (err, foundResult) => {
    foundResult.map((a) => candidateDetail.push(a));
  });
  res.render("High Score", { candidate: candidateDetail });
});

app.listen(3000);
/*
}else{
    candidateScores.firstRound = req.body.firstScore;
    candidateScores.secondRound = req.body.secondScore;
    candidateScores.thirdRound = req.body.thirdScore;*/
