var player;
var cursors;
var player_position = 'down';
var arrows;
class Scene1 extends Phaser.Scene {

	constructor() {
		super({key:"Scene1"});
	}

	preload() {
		this.load.spritesheet('player','assets/sprite_sheets/player.png',{
			frameWidth: 64,
			frameHeight: 64
		});

		this.load.spritesheet('otherPlayer','assets/sprite_sheets/player.png',{
		frameWidth: 64,
		frameHeight: 64
		});

		this.load.image('arrows','assets/sprite_sheets/arrow.png');
	}

	create() {
		//Place Player
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


		this.player = this.physics.add.sprite(100, 450, 'player');
		this.arrows = this.add.group({classType: Arrow, maxSize:10, runChildUpdate: true});

		var Arrow = new Phaser.Class({
			Extends: Phaser.GameObjects.Image,
			initialize:

			function Arrow (scene)
			{
				Phaser.GameObjects.Image.call(this, scene, 0, 0, 'arrows');
				this.speed = 0;
				this.born = 0;
			},

			fire: function (player)
			{
				this.setPosition(player.x, player.y);

				if (player.flipX)
				{
					this.speed = Phaser.Math.GetSpeed(-1000 + player.vel.x, 1);
				}//
				else
				{
					this.speed = Phaser.Math.GetSpeed(1000 + player.vel.x, 1);
				}//else
			},//Fire

			update: function (time, delta)
			{
				this.x += this.speed * delta;

				this.born += delta;

				if(this.born > 1000)
				{
					this.setActive(false);
					this.setVisible(false);
				}
			}//Update

		});
		// Arrows


		//Animation Frames
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
		this.anims.create({
    		key: 'stand_still',
    		frames: this.anims.generateFrameNumbers('player', { start: 130, end: 130 }),
    		frameRate: 10,
    		repeat: -1
		});//Stand Still
		this.anims.create({
    		key: 'rightAttack',
    		frames: this.anims.generateFrameNumbers('player', { start: 247, end: 259 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Right
		this.anims.create({
    		key: 'leftAttack',
    		frames: this.anims.generateFrameNumbers('player', { start: 221, end: 233 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Left
		this.anims.create({
    		key: 'upAttack',
    		frames: this.anims.generateFrameNumbers('player', { start: 208, end: 220 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Up
		this.anims.create({
    		key: 'downAttack',
    		frames: this.anims.generateFrameNumbers('player', { start: 234, end: 246 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Down

		//Input Event
		this.cursors = this.input.keyboard.createCursorKeys();

		this.key_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

		this.socket.on('playerMoved', function (playerInfo) {
		  self.otherPlayers.getChildren().forEach(function (otherPlayer) {
		    if (playerInfo.playerId === otherPlayer.playerId) {
		      otherPlayer.setRotation(playerInfo.rotation);
		      otherPlayer.setPosition(playerInfo.x, playerInfo.y);
		    }
		  });
		});
		
	}

	update() {
		// emit player movement
		var x = this.player.x;
		var y = this.player.y;

		if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
		  this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y });
		}
		
		// save old position data
		this.player.oldPosition = {
		  x: this.player.x,
		  y: this.player.y,
		};

		//Player Movement
		if(this.player) {
			if (this.cursors.right.isDown)
			{
    			this.player.setVelocityX(100);
	
    			this.player.anims.play('right', true);
    			this.player_position = 'right';
    			
			}//Walk Right
			else if (this.cursors.left.isDown)
			{
    			this.player.setVelocityX(-100);
	
    			this.player.anims.play('left', true);
    			this.player_position = 'left';
    			
			}//Walk Left
	
			else if (this.cursors.up.isDown)
			{
    			this.player.setVelocityY(-100);
	
    			this.player.anims.play('up', true);
    			this.player_position = 'up';
    			
			}//Walk Up
			else if (this.cursors.down.isDown)
			{
    			this.player.setVelocityY(100);
	
    			this.player.anims.play('down', true);
    			this.player_position = 'down';
    			
			}//Walk Down
			else
    		{
        			this.player.setVelocityY(0);
        			this.player.setVelocityX(0);
    		}//Don't Move Elsewise
	
    		if(this.key_1.isDown && this.player_position === 'right') {this.player.anims.play('rightAttack', true);
    			var arrow = this.arrows.get();
        			arrow.setActive(true);
        			arrow.setVisible(true);
	
        			if (arrow) { arrow.fire(this.player);}
    		}
	
    		this.arrows.children.each(function(b) {
        	if (b.active)
        	{
        	    console.log('help');
        	}
    		});
	
	
    		if(this.key_1.isDown && this.player_position === 'left') {this.player.anims.play('leftAttack', true);}
    		if(this.key_1.isDown && this.player_position === 'up') {this.player.anims.play('upAttack', true);}
    		if(this.key_1.isDown && this.player_position === 'down') {this.player.anims.play('downAttack', true);}
    	}//if(this.player)
	}//Update

}

function addPlayer(self, playerInfo) {
  self.player = self.physics.add.image(playerInfo.x, playerInfo.y, 'player');
}

function addOtherPlayers(self, playerInfo) {
  	const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer');
  	if (playerInfo.team === 'blue') {
  	otherPlayer.setTint(getRandomColor());
  	otherPlayer.playerId = playerInfo.playerId;
  	self.otherPlayers.add(otherPlayer);
	}
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color);
  return color;
}