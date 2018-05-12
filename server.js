var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var querystring = require('querystring');
var fs = require('fs');

var playerName;
var playerColor;
//middleware, required to use the modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(validator({
    errorFormatter: function(param, msg, value, location) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '['+namespace.shift()+']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));//validator

var players = {};
var gems = [10];
var boxes = [10];
var scores = {
  blue: 0,
  red: 0,
  yellow: 0
};
    //initialize gem locations
    for(i = 0; i < 10; i++) {
      gems[i] = {
        x: Math.floor(Math.random() * 1400) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        points: Math.floor(Math.random() * 2) * 5 + 5
      };
    };
    
    //initialize box locations
    for(i = 0; i < 10; i++) {
      boxes[i] = {
        x: Math.floor(Math.random() * 1400) + 50,
        y: Math.floor(Math.random() * 500) + 50,
      };
    };

app.set('view engine', 'ejs');
app.set('public', path.join(__dirname, 'public'));



//set static path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
      errors: undefined
  });//res.render end
});

app.get('/about', (req, res) => { 
    fs.readFile('public/about.html', (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Uh oh - could not find file');
            res.end();
        }
        else {

            res.writeHead(200, {'Content-Type': 'text/html'});         
            res.write(data);
            res.end();
        }
    });
});
    

app.post('/game', (req, res) => {
  req.checkBody('search_text', 'Please provide something to search').notEmpty(); 
  req.sanitizeBody('search_text').trim();
  req.sanitizeBody('search_text').escape();
  req.sanitizeBody('search_text').blacklist('\\(\\)\\;');
  var errors = req.validationErrors();

  var playerInfo = {name: req.body.search_text, color: req.body.color_text};
  console.log(req.body.search_text);
  if (errors) { //Sends to an Error Page, telling you what is wrong
      console.log(errors)
      res.render('index', {
          errors: errors
      });//res.render end
  }//if(errors)
  else
  { //Sends to an Error Page, telling you what is wrong
      console.log(errors)
      res.render('gameRoom', {
          playerConfig: playerInfo
      });//res.render end
  }
});//App.post END

app.get('/game', function(req, res){
renderGame(res).then(startServer(req));
})//app.get end

    
function renderGame(res){
  var myPromise = new Promise(function(resolve, reject){
    resolve(res.render('game', {}));
  });
  return myPromise;
}

function startServer(req){
  var myPromise = new Promise(function(resolve, reject){
    resolve(
            io.on('connection', function (socket) {
    
      console.log('a user connected: ', socket.id);
      console.log(req.query.name+' '+req.query.color);
      console.log(req.query.color);
      // create a new player and add it to our players object
      players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 1400) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        playerName: req.query.name,
        team: req.query.color
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
        } else if (players[socket.id].team === 'blue') {
          scores.blue += gems[gemId].points;
        } else {
          scores.yellow += gems[gemId].points;
        }
        io.emit('scoreUpdate', scores);
    
        gems[gemId].x = Math.floor(Math.random() * 1400) + 50;
        gems[gemId].y = Math.floor(Math.random() * 500) + 50;
        io.emit('gemLocation', gems[gemId], gemId);
      });
    }

      ));
  });
  return myPromise;
}

    server.listen(8016, function () {
      console.log(`Listening on ${server.address().port}`);
    });
