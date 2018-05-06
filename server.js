var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');

	players[socket.id] = {
	  x: Math.floor(Math.random() * 700) + 50,
	  y: Math.floor(Math.random() * 500) + 50,
	  playerId: socket.id
	};

	//send players list to new player
	socket.emit('allPlayers', players);

	//notify other players of new player
	socket.broadcast.emit('newPlayer', players[socket.id]);


  socket.on('disconnect', function () {
    console.log('user disconnected');
		console.log('player ' + socket.id + ' disconnected');
		io.emit('disconnect', socket.id);
  });
});

server.listen(3000, function() {
	console.log('Listening on ' + server.address().port);
});
