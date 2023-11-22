class Particle {
    constructor(scene, x, y) {
        // Basic properties
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = 50; // Size of the square
        this.lifespan = Phaser.Math.Between(12000, 19000); // Lifespan in milliseconds, varies between 9-15 seconds
        this.velocity = { x: Phaser.Math.Between(-100, 100), y: Phaser.Math.Between(-100, 100) };
        this.startTime = Date.now();
        this.color = this.getRandomColor();

        // Properties for glitch effect
        this.glitchThreshold = 0.0; // Chance of glitch happening in each update
        this.maxGlitchOffset = 5; // Maximum pixel offset for the glitch
        this.maxGlitchSizeIncrease = 10; // Maximum increase in size for the glitch
    }

    getRandomColor() {
        // Generate a Phaser Display Color with random green values
        let brightness = Phaser.Math.Between(50, 255);
        return Phaser.Display.Color.GetColor(0, brightness, 0);
    }

    update() {
        // Update lifespan
        let timeElapsed = Date.now() - this.startTime;
        if (timeElapsed > this.lifespan) {
            return false;
        }

        // Update position
        this.x += this.velocity.x * this.scene.game.loop.delta / 1000;
        this.y += this.velocity.y * this.scene.game.loop.delta / 1000;

        // Randomly apply glitch effect
        if (Phaser.Math.FloatBetween(0, 1) < this.glitchThreshold) {
            this.applyGlitch();
        }

        return true;
    }

    applyGlitch() {
        // Randomly adjust position and size for the glitch effect
        let glitchOffsetX = Phaser.Math.Between(-this.maxGlitchOffset, this.maxGlitchOffset);
        let glitchOffsetY = Phaser.Math.Between(-this.maxGlitchOffset, this.maxGlitchOffset);
        let glitchSizeIncrease = Phaser.Math.Between(0, this.maxGlitchSizeIncrease);

        this.x += glitchOffsetX;
        this.y += glitchOffsetY;
        this.glitchSize = this.size + glitchSizeIncrease;
    }

    draw(graphics) {
        // Draw particle with current size and color
        graphics.fillStyle(this.color, 1);
        const size = this.glitchSize || this.size; // Use glitch size if available, else default size
        graphics.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        this.glitchSize = null; // Reset glitch size after drawing
    }
}

class Level extends Phaser.Scene {
    constructor() {
        super("Level");
        this.music = null;
        this.particles = [];
        this.graphics = null;
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
		playButton.setDepth(1); // Set the depth to a higher value
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
        this.graphics = this.add.graphics();

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


        // Set up a timer event for particle spawning
        // Set up a timer event for particle spawning
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.spawnParticle(this.scale.width / 2, this.scale.height / 2);
            },
            loop: true
        });
    }

    spawnParticle(x, y) {
        this.particles.push(new Particle(this, x, y));
    }

    update() {
        this.graphics.clear();
        this.particles = this.particles.filter(particle => {
            let alive = particle.update();
            if (alive) {
                particle.draw(this.graphics);
            }
            return alive;
        });

	}
	
}