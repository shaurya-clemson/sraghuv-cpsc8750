const fetch = require('node-fetch');

// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

app.get("/trivia", async (req,res) =>{
  // res.send('TODO');

  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if(!response.ok){
      res.status(500);
      res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
      return;
  }

  // interpret the body as json
  const content = await response.json();

  // TODO: make proper HTML
  const format = JSON.stringify(content,2);

  const correctAnswer = content.results[0].correct_answer;
  const answers = content.results[0].incorrect_answers;
  answers.push(correctAnswer);

  // Randomize Answers Array
  answers.sort(() => Math.random() - 0.5)

  const answerLinks = answers.map(answer => {
      return `<a href="javascript:alert('${
        answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
        }')">${answer}</a>`
  });

  // respond to the browser
  // TODO: make proper HTML
  // res.send(JSON.stringify(content,2));
  res.render('trivia',{
      category:  content.results[0].category,
      difficulty: content.results[0].difficulty,
      question: content.results[0].question,
      answers: answers,
      answerLinks: answerLinks,
  });
});

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
// The main page of our website
/*app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>An Example Title</title>
        <link rel="stylesheet" href="app.css">
      </head>
      <body>
        <h1>Hello, World!</h1>
        <p>HTML is so much better than a plain string!</p>
      </body>
    </html>
  `);
});*/

let nextVisitorId = 1;

// the main page
app.get('/', (req, res) => {
  let time_text = "";
  //console.log(Object.keys(req.cookies).length);
  //if there are no cookies in the brower, aka they never visted, set the cookies
  if(Object.keys(req.cookies).length == 0){
    res.cookie('visitorId', nextVisitorId++);
    res.cookie('visited', new Date().toString());
    time_text = "You have never visited";

  }else{
    // get the seconds difference from the cookies
    let sec = Math.round(((new Date().getTime() - new Date(req.cookies['visited']).getTime()) / 1000), 0);
    //console.log(sec);
    time_text = "You last visited " + sec + " seconds ago.";
    res.cookie('visited', new Date().toString());
  }
  //console.log(req.cookies);
  res.render('welcome', {
    name: "World!",
    date: new Date().toLocaleString(),
    id: nextVisitorId,
    time: time_text,
  });
});


// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");