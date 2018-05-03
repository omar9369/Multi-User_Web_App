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
	scene: [ Scene1 ]
};

var game = new Phaser.Game(config);