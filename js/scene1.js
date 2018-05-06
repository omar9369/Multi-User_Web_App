/*var player;
var cursors;
var player_position = 'down';
class Scene1 extends Phaser.Scene {

	constructor() {
		super({key:"Scene1"});
	}

	preload() {
		this.load.spritesheet('sprite','assets/sprite_sheets/player.png',{
			frameWidth: 64,
			frameHeight: 64
		});
	}

	create() {
		var self = this;
		this.socket = io();
		this.socket.on('allPlayers', function(players) {
			Object.keys(players).forEach(function(id) {
				if (players[id].playerId === self.socket.id) {
        	addPlayer(self, players[id]);
      	}
			});
		});
	}


	create() {
		//Place Player
		player = this.physics.add.sprite(100, 450, 'sprite');

		//Animation Frames
		this.anims.create({
    		key: 'right',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 143, end: 147 }),
    		frameRate: 10,
    		repeat: -1
		});//Move Right
		this.anims.create({
    		key: 'left',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 117, end: 121 }),
    		frameRate: 10,
    		repeat: -1
		});//Move Left
		this.anims.create({
    		key: 'up',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 104, end: 108 }),
    		frameRate: 10,
    		repeat: -1
		});//Move Up
		this.anims.create({
    		key: 'down',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 130, end: 134 }),
    		frameRate: 10,
    		repeat: -1
		});//Move Down
		this.anims.create({
    		key: 'stand_still',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 130, end: 130 }),
    		frameRate: 10,
    		repeat: -1
		});//Stand Still
		this.anims.create({
    		key: 'rightAttack',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 247, end: 259 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Right
		this.anims.create({
    		key: 'leftAttack',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 221, end: 233 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Left
		this.anims.create({
    		key: 'upAttack',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 208, end: 220 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Up
		this.anims.create({
    		key: 'downAttack',
    		frames: this.anims.generateFrameNumbers('sprite', { start: 234, end: 246 }),
    		frameRate: 10,
    		repeat: 0
		});//Attack Down

		//Input Event
		cursors = this.input.keyboard.createCursorKeys();

		this.key_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

	}
*/
/*
	update() {
		//Player Movement
		if (cursors.right.isDown)
		{
    		player.setVelocityX(100);

    		player.anims.play('right', true);
    		player_position = 'right';
		}//Walk Right
		else if (cursors.left.isDown)
		{
    		player.setVelocityX(-100);

    		player.anims.play('left', true);
    		player_position = 'left';
		}//Walk Left

		else if (cursors.up.isDown)
		{
    		player.setVelocityY(-100);

    		player.anims.play('up', true);
    		player_position = 'up';
		}//Walk Up
		else if (cursors.down.isDown)
		{
    		player.setVelocityY(100);

    		player.anims.play('down', true);
    		player_position = 'down';
		}//Walk Down
		else
    	{
        player.setVelocityY(0);
        player.setVelocityX(0);
    	}//Don't Move Elsewise

    	if(this.key_1.isDown && player_position === 'right') {player.anims.play('rightAttack', true);}
    	if(this.key_1.isDown && player_position === 'left') {player.anims.play('leftAttack', true);}
    	if(this.key_1.isDown && player_position === 'up') {player.anims.play('upAttack', true);}
    	if(this.key_1.isDown && player_position === 'down') {player.anims.play('downAttack', true);}

	}

}
*/
