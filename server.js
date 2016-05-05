// set up dependencies
// -------------------
require('dotenv').config();
var express    = require('express'),
    bodyParser = require('body-parser'),
    app        = express();

require('./db/database.js');

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
app.use('/users', require('./controllers/users.js'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/views/index.html');
})

// start the server and sockets
// ----------------------------
var server = app.listen(3000, function(){
  console.log('The server is listening on port ' + server.address().port + '!');
})
var io = require('socket.io').listen(server)

// handlers for socket messages
// ----------------------------
io.sockets.on('connection', function(socket){
  socket.on('join-room', function(room){
    if (socket.rooms) socket.rooms = {};
    socket.join(room);
  })

  // event listener for drum triggers
  socket.on('drumPadTrigger', function(padNumber){
    for (room in socket.rooms) {
      io.sockets.in(socket.rooms[room]).emit('drumPadTrigger', padNumber);
    }

  })

  // event listeners for keyboard events
  socket.on('keyboardDown', function(data){
    for (room in socket.rooms){
      io.sockets.in(socket.rooms[room]).emit('keyboardDown', data);
    }

  })

  socket.on('keyboardUp', function(data){
    for (room in socket.rooms){
      io.sockets.in(socket.rooms[room]).emit('keyboardUp', data);
    }

  })

  // event listener for sent message
  socket.on('send-message', function(data){
    for (room in socket.rooms) {
      io.sockets.in(socket.rooms[room]).emit('new-message', data);
    }

  });
})
