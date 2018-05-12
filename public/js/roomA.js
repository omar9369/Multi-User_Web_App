var textItem;
var yourStats;
var nameText;
class roomA extends Phaser.Scene {

   constructor() {
      super({key:"roomA"});
   }

   preload() { 

    textItem = this.add.text(10, 50, 'Newest Player...', { font: '16px Courier', fill: '#00ff00' });
    yourStats = this.add.text(500, 50, '', { font: '16px Courier', fill: '#00ff00' });
     this.load.audio('cyrf','assets/cyrf_flip_a_coin.mp3', { stream: true });
      this.load.spritesheet('player','assets/player.png',{
         frameWidth: 64,
         frameHeight: 64
      });
      this.load.spritesheet('otherPlayer','assets/player.png',{
         frameWidth: 64,
         frameHeight: 64
      });
   this.load.image('redGem', 'assets/gem_red.png');
      this.load.image('purpleGem', 'assets/gem_purple.png');
      this.load.image('box', 'assets/10.png');
   }//PRELOAD

   create() {
      var self = this;
      this.socket = io();
      this.otherPlayers = this.physics.add.group();
      this.socket.on('currentPlayers', function (players) {
          Object.keys(players).forEach(function (id) { 
             if (players[id].playerId === self.socket.id) { 
                 addPlayer(self, players[id]);
              textItem.setText('You,'+players[id].playerName+', have joined the '+players[id].team+' team!');
              yourStats.setText('Team: '+players[id].team);
             } else {
                 addOtherPlayers(self, players[id]);
             }
          });
      });
      this.socket.on('newPlayer', function (playerInfo) {
          addOtherPlayers(self, playerInfo);
        textItem.setText(playerInfo.playerName+' has joined the '+playerInfo.team+' team!');
      });
      this.socket.on('disconnect', function (playerId) {
          self.otherPlayers.getChildren().forEach(function (otherPlayer) {
             if (playerId === otherPlayer.playerId) {
              textItem.setText(playerId+' has left the game!');
                 otherPlayer.destroy();
             }
          });
      });
      this.socket.on('playerMoved', function (playerInfo) {
          self.otherPlayers.getChildren().forEach(function (otherPlayer) {
             if (playerInfo.playerId === otherPlayer.playerId) {
                 otherPlayer.setPosition(playerInfo.x, playerInfo.y);
             }
          });
      });


   this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('player', { start: 143, end: 147 }),
          frameRate: 10,
          repeat: -1
      });//Move Right
      this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('player', { start: 117, end: 121 }),
          frameRate: 10,
          repeat: -1
      });//Move Left
      this.anims.create({
          key: 'up',
          frames: this.anims.generateFrameNumbers('player', { start: 104, end: 108 }),
          frameRate: 10,
          repeat: -1
      });//Move Up
      this.anims.create({
          key: 'down',
          frames: this.anims.generateFrameNumbers('player', { start: 130, end: 134 }),
          frameRate: 10,
          repeat: -1
      });//Move Down
      this.cursors = this.input.keyboard.createCursorKeys();





      this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
      this.redScoreText = this.add.text(1200, 16, '', { fontSize: '32px', fill: '#FF0000' });
              this.yellowScoreText = this.add.text(1200, 550, '', { fontSize: '32px', fill: '#FFFF00' });
      this.greenScoreText = this.add.text(16, 550, '', { fontSize: '32px', fill: '#32CD32' });

      this.socket.on('scoreUpdate', function (scores) {
          self.blueScoreText.setText('Blue: ' + scores.blue);

          self.redScoreText.setText('Red: ' + scores.red);
      self.yellowScoreText.setText('Yellow: ' + scores.yellow);

      self.greenScoreText.setText('Green: ' + scores.green);

      });

         this.socket.on('boxLocations', function (boxArray) {
            //console.log('box locations received: ' + boxArray.length);
            var boxes = self.physics.add.staticGroup();
            for(var i = 0; i < boxArray.length; i++) {
               boxes.create(boxArray[i].x, boxArray[i].y, 'box');
            }
            self.physics.add.collider(self.player, boxes);
         });



         this.socket.on('gemLocations', function (gemArray) {
            var gemType;
            //console.log('gem locations received: ' + gemArray.length);
            self.gems = [gemArray.length];
            for(var i = 0; i < gemArray.length; i++) {
               if(gemArray[i].points == 5) {
                  gemType = 'redGem';
               } else {
                  gemType = 'purpleGem'
               }
               self.gems[i] = self.physics.add.image(gemArray[i].x, gemArray[i].y, gemType);
               (function(id) {
                  self.physics.add.overlap(self.player, self.gems[id], function() {
                     this.socket.emit('gemCollected', id);
                  }, null, self);
               })(i);
            }
         });

         this.socket.on('destroyGem', function(gemId) {
            if(self.gems[gemId]) self.gems[gemId].destroy();
         });

      this.socket.on('gemLocation', function (gemInfo, id) {
            var gemType;
            if(gemInfo.points == 5) {
               gemType = 'redGem';
            } else {
               gemType = 'purpleGem';
            }
          self.gems[id] = self.physics.add.image(gemInfo.x, gemInfo.y, gemType);
             self.physics.add.overlap(self.player, self.gems[id], function () {
             this.socket.emit('gemCollected', id);
          }, null, self);
      });

    this.sound.pauseOnBlur = false;

    this.music = this.sound.add('cyrf');

    this.music.play();
   }//CREATE

   update() {
   if (this.player) {

       if (this.cursors.left.isDown) {
          this.player.setVelocityX(-100);
          this.player.anims.play('left', true);
       } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(100);
          this.player.anims.play('right', true);
       } else {
          this.player.setVelocityX(0);
       }

       if (this.cursors.up.isDown){
             this.player.setVelocityY(-100);
             this.player.anims.play('up', true);
          } else if (this.cursors.down.isDown) {
             this.player.setVelocityY(100);
             this.player.anims.play('down', true);
          } else {
             this.player.setVelocityY(0);
          }

         if(!(this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown)) {
            this.player.setFrame(130);
         }

       this.physics.world.wrap(this.player, 5);

    // emit player movement
       var x = this.player.x;
       var y = this.player.y;

       if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
          this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y});
       }
    // save old position data
          this.player.oldPosition = {
             x: this.player.x,
             y: this.player.y
          };
      }//if this player
   }//UPDATE
}

function addPlayer(self, playerInfo) {
      var fill;
      if (playerInfo.team === 'blue') { fill = '#0000FF';} else if (playerInfo.team === 'red') {fill = '#FF0000';} else if(playerInfo.team === 'yellow'){fill = '#FFFF00'}else{fill = '#32CD32'}
      self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'player');
      self.player.setBounce(1);
}

function addOtherPlayers(self, playerInfo) {
      const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer');
         otherPlayer.setFrame(130);

      if (playerInfo.team === 'blue') {
         otherPlayer.setTint('#0000FF');
      } else if (playerInfo.team === 'red') {
         otherPlayer.setTint('#FF0000');
     }else if (playerInfo.team === 'yellow') {
         otherPlayer.setTint('#FFFF00');
      } else {
        otherPlayer.setTint('##32CD32');
      }
      otherPlayer.playerId = playerInfo.playerId;
      self.otherPlayers.add(otherPlayer);
   }