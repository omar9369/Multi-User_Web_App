var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
var gems = [10];
var boxes = [10];
var scores = {
  blue: 0,
  red: 0
};

//initialize gem locations
for(i = 0; i < 10; i++) {
  gems[i] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    points: Math.floor(Math.random() * 2) * 5 + 5
  };
};

//initialize box locations
for(i = 0; i < 10; i++) {
  boxes[i] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
  };
};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);
  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // send the box objects to the new player
  socket.emit('boxLocations', boxes);
  // send the gem objects to the new player
  socket.emit('gemLocations', gems);
  // send the current scores
  socket.emit('scoreUpdate', scores);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('gemCollected', function (gemId) {
    //console.log(gemId + " collected");
    io.emit('destroyGem', gemId);
    if (players[socket.id].team === 'red') {
      scores.red += gems[gemId].points;
    } else {
      scores.blue += gems[gemId].points;
    }
    io.emit('scoreUpdate', scores);

    gems[gemId].x = Math.floor(Math.random() * 700) + 50;
    gems[gemId].y = Math.floor(Math.random() * 500) + 50;
    io.emit('gemLocation', gems[gemId], gemId);
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
