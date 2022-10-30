const fetch = require('node-fetch');

// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(cookieParser());

// set view engine to ejs
app.set('view engine', 'ejs');

let nextVisitorId = 1;


//The new main page
app.get('/', (req, res) => {
  let lastVisited = req.cookies.visited;
  let currentVisitorId = req.cookies.visitorId;
  
  res.cookie('visited', Date.now().toString());

  if(!currentVisitorId){
    currentVisitorId = ++nextVisitorId;
    res.cookie('visitorId', currentVisitorId);
  }

  if(lastVisited){
    lastVisited = Math.floor((Date.now() - lastVisited) / 1000);
  }
  else{
    lastVisited = null;
  }  

  console.log(req.cookies.visited);

  res.render('welcome', {
    name: req.query.name || "World",
    currentVisitDate: new Date().toLocaleString(),
    currentVisitorId: currentVisitorId,
    timeSinceLastVisit: lastVisited  
  });
});

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  /*// fail if db failed
  if (data.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
    return;*/

  const format = JSON.stringify(content,2);

  const correctAnswer = content.results[0].correct_answer;
  const answers = content.results[0].incorrect_answers;
  answers.push(correctAnswer);

  const answerLinks = answers.map(answer => {
    return `<a href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>`
});

res.render('trivia',{
  category:  content.results[0].category,
  difficulty: content.results[0].difficulty,
  question: content.results[0].question,
  answers: answers,
  answerLinks: answerLinks,
});
  
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");