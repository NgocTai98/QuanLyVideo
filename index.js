var express = require('express');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
app.listen(3000);

var mysql = require('mysql');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage }).single('image');



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
        }else
        {
            res.render("home",{results});
        }
        
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
});
app.get('/video/add', function (req, res) {
    res.render('add');
});
app.post('/video/add',urlencodedParser, function (req, res) {
    upload(req, res, function (err) {
        if (err ) {
          res.send('errors');
        } else {
           var sql = "insert into video (title, description, code, image) values('"+req.body.title+"','"+req.body.description+"','"+req.body.code+"','"+req.file.originalname+"')";
           connection.query(sql, function (error, results, fields) {
               if (error) {
                   res.send('error query')
               } else {
                res.redirect('./list');
               }
           
          });
        }
    
      })
});
app.get('/video/edit/:id', function (req, res) {
    connection.query('SELECT * FROM video where id='+req.params.id , function (error, results, fields) {
        if (error) {
            throw error;
        }else
        {
            res.render("edit",{results});
        }  
        
        
      });
});
app.post('/video/edit/:id', function (req, res) {
    var id = req.params.id;
    upload(req, res, function (err) {
        if (err ) {
          res.send('errors');
        } else {
           if (typeof(req.file)=='undefined') {
               res.redirect('../list');              
           } else {
            var sql2 = "UPDATE video set title= '"+req.body.title+"',description= '"+req.body.description+"',code= '"+req.body.code+"',image= '"+req.file.originalname+"' where id ='"+id+"'";
            connection.query(sql2, function (error, results, fields) {
                if (error) {
                    res.send('error query');
                } else {
                    res.redirect("../list")
                }
            
           });
           }
        }
    
      })
})
