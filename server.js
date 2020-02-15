const express = require('express');
const people = require('./people.json');
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'pug');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index', {
      title: 'Homepage',
      people: people.profiles
    })
});
  
app.get('/profile', (req, res) => {
  const person = people.profiles.find(p => p.id === req.query.id);
  res.render('profile', {
    title: `About ${person.firstname} ${person.lastname}`,
    person,
  });
});

app.get('/add', (req, res) => {
  res.render('add', {
    title: 'Add Recipe',
    people: people.profiles
  })
});

fetch('/create', {
  method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        recipe: {
            name: "John",
            author: "john@example.com"
        }
    })
});

app.post('/create', function(request, response){
  console.log(request.body.recipe.name);
  console.log(request.body.recipe.author);
});

app.post("/", function (req, res) {
  console.log(request.body.recipe.name)
});

const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});