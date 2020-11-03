var morgan = require('morgan')
var winston = require(__dirname + '/config/winston.js')
var express = require('express');
var app = express();
var db_config = require(__dirname + '/config/database.js');
var db_config_readonly = require(__dirname + '/config/database_readonly.js');
var conn = db_config.init();
var conn_readonly = db_config_readonly.init();
var bodyParser = require('body-parser');

db_config.connect(conn);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(morgan('combined', {stream: winston.stream}));

app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.get('/list', function (req, res) {
    var sql = 'SELECT * FROM BOARD';
    conn_readonly.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('list.ejs', {list : rows});
    });
});

app.get('/write', function (req, res) {
    res.render('write.ejs');
});

app.post('/writeAf', function (req, res) {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO BOARD VALUES(?, ?, ?, NOW())';
    var params = [body.id, body.title, body.content];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) console.log('query is not excuted. insert fail...\n' + err);
        else res.redirect('/list');
    });
});

app.listen(3000, () => winston.info('Server is running on port 3000...'));
