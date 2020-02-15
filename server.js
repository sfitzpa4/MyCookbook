const express = require('express');
const people = require('./people.json');
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'pug');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({extended: false}));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());


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
  console.log('ADD PAGE');
  res.render('add', {
    title: 'Add Recipe',
    people: people.profiles
  })
});

// fetch('/create', {
//   method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         recipe: {
//             name: "1",
//             author: "2"
//         }
//     })
// });

// app.post('/create', function(request, response){
//   console.log('POST GOT 1');
//   console.log(request.body.name);
//   console.log(request.body.author);
// });

app.post("/add", function (req, res) {
  console.log('POST GOT 2');
  console.log(req.body.name);
  console.log(req.body.author);
  res.render('add', {
    title: 'Add Recipe',
    people: people.profiles
  })
});

const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});