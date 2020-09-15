var bcrypt = require('bcrypt');
var connection = require('./connection.js');
const saltRounds = 10;

exports.signup = async function(req, res) {
    console.log('Signup Post');
    console.log(req.body.first_name);
    console.log(req.body.last_name);
    console.log(req.body.username);
    console.log(req.body.password);
    var id;
    connection.query("SELECT COUNT(id) FROM user_profile;", function(err, result){
      id = JSON.stringify(result[0]).split(":")[1].split("}")[0];
      console.log(result[0]);
      console.log(id);
    })
    var encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
    var user_profile = {
      "id": parseInt(id) + 1,
      "first_name": req.body.first_name,
      "last_name": req.body.last_name,
      "image": "image1",
      "username": req.body.username,
      "password": encryptedPassword
    }

    var sql = "INSERT INTO user_profile (id,first_name,last_name,image,username,password) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(sql, [user_profile.id, user_profile.first_name, user_profile.last_name, user_profile.image, user_profile.username, user_profile.password], function(err, result){
      if(err) throw err;
            console.log("1 record inserted");
        });
        console.log("POST user_profile");

        req.on('end', function (){
            fs.appendFile(filePath, body, function() {
                res.end();
            });
        });
    res.render('login', {
        title: 'Log In',
    })
}

exports.login = async function(req,res){
    console.log(req.body.username);
    console.log(req.body.password);
    var username= req.body.username;
    var password = req.body.password;
    connection.query('SELECT * FROM user_profile WHERE username = ?',[username], async function (error, results, fields) {
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        if(results.length >0){
          const comparision = await bcrypt.compare(password, results[0].password)
          if(comparision){
              res.send({
                "code":200,
                "success":"login sucessful"
              })
          }
          else{
            res.send({
                 "code":204,
                 "success":"username and password does not match"
            })
          }
        }
        else{
          res.send({
            "code":206,
            "failure":"username does not exist"
              });
        }
      }
    });
    connection.query("SELECT * FROM recipes", function(err, result){
      if(err) throw err;
      var queryArr = [];
      result.forEach(function(item) {
        console.log(JSON.parse(JSON.stringify(item)));
        queryArr.push(JSON.parse(JSON.stringify(item)));
      });
      res.render('homepage', {
        title: 'Welcome: ' + username,
        query: queryArr
      })
    });
  }
