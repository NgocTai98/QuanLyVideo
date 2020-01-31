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
    connection.query('SELECT * FROM video', function (error, rows, fields) {
        if (!!error) {
            console.log("Error in query");
        }
        else {
            console.log("successful query");
            console.log(rows);
        }  
      });
    res.render("home");
})
