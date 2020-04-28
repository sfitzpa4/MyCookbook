var mysql = require('mysql');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var connection = mysql.createConnection({

    host     : '127.0.0.1',
    user     : 'root',
    password : 'GordonTwenty4!',
    database : 'maindb'
  
});
connection.connect(function(error) {
    if (!!error) {
      console.log(error);
    } else {
      console.log('Database Connected');
    }
});

exports.signup = async function(req, res) {
    console.log('Signup Post');
    console.log(req.body.first_name);
    console.log(req.body.last_name);
    console.log(req.body.username);
    console.log(req.body.password);
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var username = req.body.username;
    var password = req.body.password;
    var encryptedPassword = await bcrypt.hash(password, saltRounds);
    var image = "image1";
    var id = 1;
    var sql = "INSERT INTO user_profile (id,first_name,last_name,image,username,password) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(sql, [id, first_name, last_name, image, username, encryptedPassword], function(err, result){
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
            "success":"username does not exits"
              });
        }
      }
      });
      res.render('add', {
        title: 'Successful Login: ' + username,
      })
  }
