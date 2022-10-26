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

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");