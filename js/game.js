var config = {
	type:Phaser.AUTO,
	width:800,
	height:600,
	physics: {
		default:'arcade',
		arcade: {
			gravity: {y : 0}
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

function preload() {
	this.load.spritesheet('sprite','assets/sprite_sheets/player.png',{
		frameWidth: 64,
		frameHeight: 64
	});
}

function create() {
	var self = this;
	self.otherPlayers = this.physics.add.group();

	this.socket = io();

	this.socket.on('allPlayers', function(players) {
		Object.keys(players).forEach(function(id) {
			if (players[id].playerId === self.socket.id) {
				addPlayer(self, players[id]);
			} else {
				addOtherPlayers(self, players[id]);
			}
		});
	});

	this.socket.on('newPlayer', function(playerInfo) {
		addOtherPlayers(self, playerInfo);
	});

	this.socket.on('disconnect', function(playerId) {
		self.otherPlayers.getChildren().forEach(function(player) {
			if(playerId === player.playerId) {
				console.log('player ' + playerId + ' disconnected');
				player.destroy();
			}
		});
	});
}

function update() {

}

function addPlayer(self, playerInfo) {
	self.sprite = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'sprite');
}

function addOtherPlayers(self, playerInfo) {
  const other = self.add.sprite(playerInfo.x, playerInfo.y, 'sprite');
  other.playerId = playerInfo.playerId;
  self.otherPlayers.add(other);
}
