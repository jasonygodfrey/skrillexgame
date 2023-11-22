//main.js
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1080,
		height: 1920,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
        	default: 'arcade',
        	arcade: {
            	debug: false, // Set this to true to view lines for debugging
        	},
    	},
	});

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
	game.scene.add("GameScene", GameScene);
	game.scene.add("GameScene2", GameScene2);
	game.scene.add("GameComplete", GameComplete);

});


class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}