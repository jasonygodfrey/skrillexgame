//Level.js

class Level extends Phaser.Scene {

	constructor() {
		super("Level");
		this.music = null;
	}

	editorCreate() {
		this.music = this.sound.add("music", { loop: true });
		this.music.play();

		const gameWidth = this.scale.width;
		const gameHeight = this.scale.height;

		const background = this.add.image(gameWidth / 2, gameHeight / 2, "background2");
		background.setDisplaySize(gameWidth, gameHeight);

		const text_1 = this.add.text(gameWidth / 2, 480, "", {});
		text_1.setOrigin(0.5, 0);
		text_1.text = "";
		text_1.setStyle({
			fontFamily: "Fantasy",
			fontSize: "80px",
			fill: "#ff96f5",
			stroke: "#ffffff",
			strokeThickness: 4,
			shadow: {
				offsetX: 2,
				offsetY: 2,
				color: "#ffc0e3",
				blur: 8,
				stroke: true,
				fill: true,
			},
		});

		const colors = ["#ffffff", "#add8e6", "#800080"];
		let currentIndex = 0;

		this.time.addEvent({
			delay: 1000,
			callback: () => {
				currentIndex = (currentIndex + 1) % colors.length;
				const color = colors[currentIndex];
				text_1.setFill(color);
			},
			loop: true,
		});

		const playButton = this.add.image(gameWidth / 2, gameHeight / 2 , "playbutton");
		playButton.setInteractive();
		playButton.setScale(0.8);

		playButton.isTweening = false;

		playButton.on("pointerup", () => {
			
			if (!playButton.isTweening) {
				playButton.isTweening = true;

				this.tweens.add({
					targets: playButton,
					scaleX: 0.45,
					scaleY: 0.45,
					yoyo: true,
					duration: 200,
					onComplete: () => {
						playButton.isTweening = false;
						this.music.stop();
						this.game.canvas.style.cursor = 'none';
						this.scene.start("GameScene");
					}
				});
			}
		});
	}

	create() {
		this.editorCreate();

		this.input.setDefaultCursor('url(assets/starcursor.png), pointer');




		
	
		// Create the "Dev Contact" button text
		let devContactButton = this.add.text(
			this.scale.width / 2, 
			this.scale.height - 350, // 50 units from the bottom of the game screen
			'>Dev Contact ⊂(◉‿◉)つ', 
			{
				fontFamily: 'Arial',
				fontSize: '44px',
				fill: '#ffffff',
				align: 'center'
			}
		);
	
		// Center align the text
		devContactButton.setOrigin(0.5, 0.5);
	
		// Enable the hand cursor on hover
		devContactButton.setInteractive({ useHandCursor: true });
	
		// Change the color on hover
		devContactButton.on('pointerover', () => {
			devContactButton.setFill('#B57EDC'); // Change to light purple color on hover

			// Bounce effect on hover
			this.tweens.add({
				targets: devContactButton,
				y: devContactButton.y - 10, // move up a little
				duration: 300,
				ease: 'Power2',
				yoyo: true, // it will reverse the tween immediately, making it look like a bounce
			});
		});
	
		// Change the color back when the mouse leaves
		devContactButton.on('pointerout', () => {
			devContactButton.setFill('#ffffff'); // Change back to white when not hovering
		});
	
		// Add a pointer up listener
		devContactButton.on('pointerup', () => {
			// Open the dev website on click
			window.open('https://jasongodfrey.dev', '_blank');
		});

		
	}
	
}
