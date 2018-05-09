class roomA extends Phaser.Scene {

	constructor() {
		super({key:"roomA"});
	}

  	preload() {
  		this.load.spritesheet('player','assets/player.png',{
			frameWidth: 64,
			frameHeight: 64
		});
  		this.load.spritesheet('otherPlayer','assets/player.png',{
			frameWidth: 64,
			frameHeight: 64
		});
  	this.load.image('star', 'assets/star_gold.png');
	}//PRELOAD

  	create() {
  		var self = this;
  		this.socket = io();
  		this.otherPlayers = this.physics.add.group();
  		this.socket.on('currentPlayers', function (players) {
    		Object.keys(players).forEach(function (id) {
      			if (players[id].playerId === self.socket.id) {
        			addPlayer(self, players[id]);
      			} else {
        			addOtherPlayers(self, players[id]);
      			}
    		});
  		});
  		this.socket.on('newPlayer', function (playerInfo) {
    		addOtherPlayers(self, playerInfo);
  		});
  		this.socket.on('disconnect', function (playerId) {
    		self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      			if (playerId === otherPlayer.playerId) {
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
  		this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });
  
  		this.socket.on('scoreUpdate', function (scores) {
    		self.blueScoreText.setText('Blue: ' + scores.blue);
    		self.redScoreText.setText('Red: ' + scores.red);
  		});

  		this.socket.on('starLocation', function (starLocation) {
    		if (self.star) self.star.destroy();
    		self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
   		 	self.physics.add.overlap(self.player, self.star, function () {
      			this.socket.emit('starCollected');
    		}, null, self);
  		});
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
  		self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'player');

	}
function addOtherPlayers(self, playerInfo) {
  		const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer');
  		otherPlayer.setTint(0x0000ff);
  		otherPlayer.playerId = playerInfo.playerId;
  		self.otherPlayers.add(otherPlayer);
	}