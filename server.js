const express = require('express');
const people = require('./people.json');
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const multer = require("multer");
var mysql = require('mysql');
const app = express();
var fs = require('fs')
var url = require('url');

// Routes
var connection = require('./routes/connection.js');
var login = require('./routes/login');

app.set('view engine', 'pug');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({extended: false}));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

var storageVar = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/images")
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var upload = multer({storage: storageVar})

app.get('/', (req, res) => {
  connection.query("SELECT * FROM recipes", function(err, result){
    if(err) throw err;
    var queryArr = [];
    result.forEach(function(item) {
      //console.log(JSON.parse(JSON.stringify(item)));
      queryArr.push(JSON.parse(JSON.stringify(item)));
    });

    res.render('homepage', {
      title: 'Welcome',
      query: queryArr,
    })
  });
});

app.get('/recipes', (req, res) => {
  connection.query("SELECT * FROM recipes", function(err, result){
    if(err) throw err;
    var queryArr = [];
    result.forEach(function(item) {
      //console.log(JSON.parse(JSON.stringify(item)));
      queryArr.push(JSON.parse(JSON.stringify(item)));
    });

    res.render('recipes', {
      title: 'Recipes',
      query: queryArr,
    })
  });
});
  

app.get('/add', (req, res) => {
  //console.log('ADD PAGE');
  res.render('add', {
    title: 'Add Recipe',
  })
});

app.get('/login', (req,res) => {
  res.render('login', {
    title: 'Log In'
  })
});

app.get('/signup', (req,res) => {
  res.render('signup', {
    title: 'Sign Up'
  })
});

app.post('/signup', login.signup);
app.post('/login', login.login);

app.post("/create", upload.single('myFile'), (req, res, next) => {
  /* console.log(req.body);
  console.log(req.body.name);
  console.log(req.body.author);
  console.log(req.body.ingredients);
  console.log(req.body.directions);
  console.log('Attempting to upload file'); */

  // Stage Image File
  var img = fs.readFileSync(req.file.path);
  var imgPath = req.file.path.split("public\\")[1].replace("\\", "/");
  //console.log(imgPath);
  var encode_image = img.toString('base64');
  //var img_sql = "INSERT INTO images (imageData) VALUES (?)";
  var finalImg = new Buffer.from(encode_image, 'base64');

  // Prepare SQL for Form
  var sql = "INSERT INTO recipes (name,author,ingredients,directions,image) VALUES (?, ?, ?, ?, ?)";
  var recipeName=req.body.name;
  var authorName=req.body.author;
  var ingredientList = req.body.ingredients;
  var directions = req.body.directions;

  req.on('end', function (){
      fs.appendFile(filePath, body, function() {
          res.end();
      });
  });
  connection.query(sql, [recipeName, authorName, ingredientList, directions, imgPath], function(err, result){
      if(err) throw err;
          console.log("1 record inserted");
      });
  //console.log("POST");
  res.render('add', {
    title: 'Add Recipe',
    people: people.profiles
  })
});

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});


// Unused

app.post('/data', function(req, res){
  var recipeName=req.body.name;
  var authorName=req.body.author;
  var ingredientList = req.body.ingredients;
  connection.query("INSERT INTO recipes (name,author,ingredients) VALUES (?, ?, ?);", 
  recipeName, authorName, ingredientList, function(err, result){
      if(err) throw err;
          console.log("1 record inserted");
      });
  res.send(recipeName);
  console.log("POST");
});

app.get('/profile', (req, res) => {
  const person = people.profiles.find(p => p.id === req.query.id);
  res.render('profile', {
    title: `About ${person.firstname} ${person.lastname}`,
    person,
  });
});

app.post("/uploadFile", upload.single('myFile'), (req, res, next) => {
  console.log('Attempting to upload file');
  var img = fs.readFileSync(req.file.path);
  console.log(req.file.path);
  var encode_image = img.toString('base64');
  var sql = "INSERT INTO images (imageData) VALUES (?)";
  var finalImg = new Buffer.from(encode_image, 'base64');
  console.log(finalImg.toString());
  connection.query(sql, [req.file.path], function(err, result){
    if(err) throw err;
    console.log("1 record inserted");
  });
  console.log("POST");
});