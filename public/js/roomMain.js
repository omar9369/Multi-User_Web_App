class roomMain extends Phaser.Scene {

	constructor() {
		super({key:"roomMain"});
	}

  	preload() {

	}//PRELOAD

  create() {
    this.texta = this.add.text(0,0,"Press 1 to enter room 1", {font:"40px Impact"});
    this.textb = this.add.text(0,100,"Press 2 to enter room 2", {font:"40px Impact"});
    this.textc = this.add.text(0,200,"Press 3 to enter room 3", {font:"40px Impact"});
    this.textd = this.add.text(0,300,"Press 4 to enter room 4", {font:"40px Impact"});

    this.cursors = this.input.keyboard.createCursorKeys();

	}//CREATE

	update() {
    if (this.cursors.up.isDown) {
          this.scene.start("roomA");
      } else if (this.cursors.right.isDown) {
          this.scene.start("roomB");
      } else if (this.cursors.down.isDown) {
          this.scene.start("roomC");
      } else if (this.cursors.left.isDown) {
          this.scene.start("roomD");
      }
	}//UPDATE
}

