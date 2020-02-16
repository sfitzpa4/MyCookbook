const express = require('express');
const people = require('./people.json');
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
var fs = require('fs')
var url = require('url');

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

app.get('/login', (req,res) => {
  res.render('login', {
    title: 'Log In'
  })
});

app.post('/login', (req,res) => {
  console.log('Login Post');
  console.log(req.body.username);
  console.log(req.body.password);
});

app.post("/create", function (req, res) {
  console.log('POST GOT 2');
  console.log(req.body.name);
  console.log(req.body.author);
  console.log(req.body.ingredients)
  var body = '';
    filePath = __dirname + '/public/data.txt';
    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function (){
        fs.appendFile(filePath, body, function() {
            res.end();
        });
    });
  res.render('add', {
    title: 'Add Recipe',
    people: people.profiles
  })
});

const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});