var express = require('express');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
app.listen(3000);

var mysql = require('mysql');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'QuanLyVideo'
});

connection.connect(function (error) {
    if (!!error) {
        console.log("Error");
    }
    else {
        console.log("connected");
    }
});



app.get('/', function (req, res) {
    connection.query('SELECT * FROM video', function (error, results, fields) {
        if (error) {
            throw error;
        }
        res.render("home",{results});
      });
    
});
app.get('/video/list', function (req, res) {
    connection.query('SELECT * FROM video', function (error, results, fields) {
        if (error) {
            throw error;
        }  
        res.render("list",{results});
      });
    
});
app.get('/delete/:id', function (req, res) {
    connection.query("delete from video where id = " + req.params.id, function (error, results, fields) {
        res.redirect('/video/list');
      });
    // res.send(req.params.id);
})
