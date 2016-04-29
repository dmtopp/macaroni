// set up dependencies
// -------------------
require('dotenv');
var express    = require('express'),
    bodyParser = require('body-parser'),
    app        = express();

// configure our public and views folders
// --------------------------------------
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

// config for body-parser package
// ------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up controllers
// ------------------
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/views/index.html');
})

// start the server
// ----------------
var server = app.listen(3000, function(){
  console.log('The server is listening on port ' + server.address().port + '!');
})
