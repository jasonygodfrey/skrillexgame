//GameScene.js
class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");

        /* START-USER-CTR-CODE */

        // Initialize the player's health
        this.playerHealth = 10;
        // Flag to track if player ship has been hit in the current frame
        this.playerHit = false;

        // Flag to track game over state
        this.isGameOver = false;

        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    shootProjectileFromEnemy(enemy) {
        // Create the enemy projectile
        const projectile = this.physics.add.sprite(enemy.x, enemy.y + 50, 'purplejelly');
        projectile.setScale(0.2); // Adjust the scale if necessary

        // Add the enemy projectile to the enemyProjectiles group
        this.enemyProjectiles.add(projectile);

        // Set the speed of the enemy projectile
        const projectileSpeed = 250; // Adjust the speed as needed

        // Calculate the distance the projectile needs to travel to move off screen
        const distance = this.sys.game.config.height - (enemy.y + 50);

        // Move the projectile downwards
        this.tweens.add({
            targets: projectile,
            y: `+=${distance}`, // move downwards off screen
            angle: 360, // rotate 360 degrees
            duration: 1000 * (distance / projectileSpeed), // time based on speed
            onComplete: () => {
                projectile.destroy(); // destroy the projectile when it goes off screen
            }
        });
    }



    shootProjectile() {

        if (this.isGameOver) {
            return; // Do not shoot projectiles if the game is over
        }
        // Create the projectile
        let projectile = this.physics.add.sprite(this.player.x, this.player.y - 50, 'boba1');
        projectile.setScale(0.2); // Adjust the scale of the projectile if necessary

        // Set the speed of the projectile
        let projectileSpeed = 190;

        // Calculate the distance the projectile needs to travel to move off screen
        let distance = this.player.y + 50;

        // Move the projectile up (in Galaga, projectiles move upwards)
        this.tweens.add({
            targets: projectile,
            y: `-=${distance}`, // move upwards off screen
            angle: 360, // rotate 360 degrees
            duration: 1000 * (distance / projectileSpeed), // time based on speed
            onComplete: () => {
                projectile.destroy(); // destroy the projectile when it goes off screen
            }
        });

        // Add the projectile to the group
        this.projectiles.add(projectile);
    }

    destroyEnemy(projectile, enemy) {
        // This function is called whenever a projectile overlaps with an enemy
      
        // Remove the enemy
        enemy.destroy();
      
        // Remove the projectile
        projectile.destroy();
      
        // Check the number of remaining enemies
        const remainingEnemies = this.enemies.getChildren().length;
        if (remainingEnemies === 0) {
            this.sound.stopAll(); // Stop all currently playing sounds

            this.scene.start("GameScene2");
            

         
        }
      }
      

    /** @returns {void} */
    editorCreate() {
        // Load the background image
        // Create the "pinkstars1" tileSprite
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;
        this.background = this.add.tileSprite(gameWidth / 2 - 100, gameHeight / 2, gameWidth, gameHeight, "pinkstars1");

        // Calculate the scale for the background based on the game window size and image dimensions
        const scaleRatioX = gameWidth / 787;
        const scaleRatioY = gameHeight / 1800;
        const scaleMultiplier = 2; // Adjust the value to increase or decrease the scale
        this.background.setScale(scaleRatioX * scaleMultiplier, scaleRatioY * scaleMultiplier);

        // Load the audio
        const music = this.sound.add("queen", { loop: true });
        music.play();
        this.events.emit("scene-awake");

        
    }




    /* START-USER-CODE */
    preload() {
        this.load.pack("assetPack", "assets/asset-Pack.json");




        // Load the sprite sheet with new frame dimensions
        this.load.spritesheet('sparkle1', 'assets/sparkle1spritesheet.png', { frameWidth: 33.2, frameHeight: 60 });
    }

    // Write more your code here
    create() {
        this.editorCreate();

        this.input.setDefaultCursor('none');




        // Create the enemy projectiles group with physics
        this.enemyProjectiles = this.physics.add.group();

        // Create an animation from the new sprite sheet
        this.anims.create({
            key: 'sparkle',
            frames: this.anims.generateFrameNumbers('sparkle1', { start: 0, end: 91 }), // Adjust the end frame as per your spritesheet
            frameRate: 60,
            repeat: -1
        });



        // Create the player spaceship
        this.player = this.add.sprite(640, 600, 'ship1');
        this.player.setScale(0.5); // Adjust the scale to make it smaller

        // Enable physics for the player sprite
        this.physics.world.enable(this.player);

        // Add the sparkle animation as the 'exhaust' of the player ship
        this.playerExhaust = this.add.sprite(this.player.x, this.player.y + 90, 'sparkle1');
        this.playerExhaust.play('sparkle');
        this.playerExhaust.setScale(2, 2); // Adjust the scale to make the height smaller


        // Set the depth of the playerExhaust to be less than the player
        this.playerExhaust.setDepth(1);


        // Enable input for the player spaceship
        this.player.setInteractive();
        this.input.setDraggable(this.player);

        // Register the pointermove event to update the player spaceship's position
        this.input.on('pointermove', (pointer) => {
            this.player.x = pointer.x;
            this.player.y = pointer.y;
        });

        // Hide the mouse cursor when over the player spaceship
        this.input.on('pointerover', () => {
            document.body.style.cursor = 'none';
        });

        // Show the mouse cursor when not over the player spaceship
        this.input.on('pointerout', () => {
            document.body.style.cursor = 'default';
        });

        // Create the level indicator text
        this.levelText = this.add.text(
            this.sys.game.config.width - 20,
            20,
            'Level: 1',
            {
                fontFamily: 'Arial',
                fontSize: '44px',
                fill: '#ffffff',
                align: 'right'
            }
        );
        this.levelText.setOrigin(1, 0);

        // Create the health bar
        const healthBarWidth = 350;
        const healthBarHeight = 35;
        const healthBarX = 20;
        const healthBarY = 20;
        const healthBarFillColor = 0xff0000; // Red color
        this.healthBar = this.add.rectangle(healthBarX, healthBarY, healthBarWidth, healthBarHeight, healthBarFillColor);
        this.healthBar.setOrigin(0, 0);
        this.healthBar.setScale(1, 1); // Adjust the scale to modify the health level

        // Create the health text
        this.healthText = this.add.text(
            healthBarX + healthBarWidth / 2,
            healthBarY + healthBarHeight / 2,
            'BloodSugar: 10',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff',
                align: 'center'
            }
        );
        this.healthText.setOrigin(0.7, 0.5); // Center the text horizontally and vertically within the health bar


        // Create the projectiles group with physics
        this.projectiles = this.physics.add.group();

        // Create the enemy group with physics
        this.enemies = this.physics.add.group();

        // Add 10 enemy sprites to the group
        for (let i = 0; i < 10; i++) {
            const enemy = this.add.sprite(
                Phaser.Math.Between(0, this.sys.game.config.width),
                Phaser.Math.Between(-500, -100),
                'enemy1'
            );
            enemy.setScale(0.5);
            enemy.hitByProjectile = false; // Add the custom property to track hits
            this.enemies.add(enemy);
            this.tweens.add({
                targets: enemy,
                y: Phaser.Math.Between(100, 300),
                duration: 2000,
                ease: 'Power1',
                delay: i * 200,
            });
        }



        // Overlap detection between projectiles and enemies
        this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => {
            if (!enemy.hitByProjectile) { // Check if the enemy has not been hit before
                this.destroyEnemy(projectile, enemy);
                enemy.hitByProjectile = true; // Mark the enemy as hit
            }
        }, null, this);

        // Start the shooting timer
        this.time.addEvent({
            delay: 3000,
            callback: this.shootProjectile,
            callbackScope: this,
            loop: true
        });


        // Start the enemy shooting timer
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.enemies.getChildren().forEach((enemy) => {
                    if (!enemy.hitByProjectile) {
                        this.shootProjectileFromEnemy(enemy);
                    }
                });
            },
            callbackScope: this,
            loop: true
        });


        // Enable collision between projectiles and enemies
        this.physics.add.collider(this.projectiles, this.enemies, (projectile, enemy) => {
            if (!enemy.hitByProjectile && !enemy.isShooting) {
                this.destroyEnemy(projectile, enemy);
                enemy.hitByProjectile = true;
            }
        });

        // Create the enemy projectiles group with physics
        this.enemyProjectiles = this.physics.add.group();

        // Enable collision between enemy projectiles and the player
        this.physics.add.collider(this.enemyProjectiles, this.player, (player, projectile) => {
            if (!this.playerHit) {
                projectile.destroy(); // Destroy the enemy projectile

                // Decrease the player's health
                this.playerHealth -= 1;

                // Update the health text
                this.healthText.setText(`BloodSugar: ${this.playerHealth}`);

                //GAMEOVER GAME OVER LOGIC :):):):)

                if (this.playerHealth <= 0) {
                    // Player is defeated, show game over screen
                    const centerX = this.sys.game.config.width / 2;
                    const centerY = this.sys.game.config.height / 2;

                    const gameoverImage = this.add
                        .image(centerX, centerY - 50, "gameover")
                        .setScale(1.5)
                        .setOrigin(0.5)
                        .setDepth(10000); // Set high depth value

                    const menuButtonImage = this.add
                        .image(centerX, centerY + 300, "menubutton")
                        .setScale(0.8)
                        .setOrigin(0.5)
                        .setDepth(10000); // Set high depth value
                    menuButtonImage.setInteractive();


                    // Stop all ongoing tweens and physics
                    this.physics.pause();
                    //this.tweens.pauseAll();
                    
                    menuButtonImage.on("pointerup", () => {
                        this.playerHealth = 10;
                        this.sound.stopAll(); // Stop all currently playing sounds
                    
                        // Create a bounce animation for the button
                        this.tweens.add({
                            targets: menuButtonImage,
                            y: "-=20", // Move the button up
                            duration: 100,
                            yoyo: true,
                            repeat: 1
                        });
                    
                        // Start the "Level" scene after the bounce animation is complete
                        this.time.delayedCall(200, () => {
                            this.isGameOver = false;
                            this.scene.start("Level");
                        });
                    });
                    



                    // Set the game over flag to true
                    this.isGameOver = true;




                    // Make the player inactive and visible
                    this.player.setActive(false).setVisible(false);
                    this.input.setDefaultCursor('url(assets/starcursor.png), pointer');

                    // Optionally, you can add a timed event that will restart the game (scene)
                    // after a few seconds of showing the 'game over' image
                    //this.time.delayedCall(3000, () => this.scene.restart(), [], this);
                }


                this.playerHit = true; // Set the flag to true to prevent multiple collisions within the same frame

                // Flash the player sprite to indicate getting hit
                this.tweens.add({
                    targets: this.player,
                    alpha: 0.5, // Set the alpha to a lower value temporarily
                    duration: 100,
                    yoyo: true,
                    repeat: 3,
                    onComplete: () => {
                        this.player.alpha = 1; // Reset the alpha value to 1
                    }
                });
            }
        }, null, this);





    }




    update() {
        // Update the position of the exhaust to follow the player ship
        this.playerExhaust.x = this.player.x;
        this.playerExhaust.y = this.player.y + 110;

        // Scroll the background slower
        this.background.tilePositionY -= 0.6;

        // Reset the playerHit flag in each update frame
        this.playerHit = false;

        // Update the health bar
        const healthBarWidth = 200;
        const healthPercentage = this.playerHealth / 10; // Convert the health to a percentage value
        this.healthBar.setScale(healthPercentage, 1); // Adjust the health bar scale based on the health percentage

        // Handle collision between projectiles and enemies
        this.physics.add.collider(this.projectiles, this.enemies, (projectile, enemy) => {
            if (!enemy.hitByProjectile && !enemy.isShooting) {
                enemy.hitByProjectile = true;
                this.destroyEnemy(projectile, enemy);
            }
        });

        // Handle collision between enemy projectiles and the player
        this.physics.add.collider(this.enemyProjectiles, this.player, (player, projectile) => {
            if (!this.playerHit) {
                projectile.destroy(); // Destroy the enemy projectile

                // Decrease the player's health
                this.playerHealth -= 1;

                // Update the health text
                this.healthText.setText(`BloodSugar: ${this.playerHealth}`);

                if (this.playerHealth <= 0) { // Modified here
                    console.log("Game over triggered");
                    // Player is defeated, show game over screen
                    const centerX = this.sys.game.config.width / 2;
                    const centerY = this.sys.game.config.height / 2;
                    this.add.image(centerX, centerY, 'gameover').setScale(0.5).setOrigin(0.5);

                    // Stop all ongoing tweens and physics
                    this.physics.pause();
                    this.tweens.pauseAll();

                    // Make the player inactive and visible
                    this.player.setActive(false).setVisible(false);

                    // Optionally, you can add a timed event that will restart the game (scene)
                    // after a few seconds of showing the 'game over' image
                    this.time.delayedCall(3000, () => this.scene.restart(), [], this);
                }

                this.playerHit = true; // Set the flag to true to prevent multiple collisions within the same frame

                // Flash the player sprite to indicate getting hit
                this.tweens.add({
                    targets: this.player,
                    alpha: 0.5, // Set the alpha to a lower value temporarily
                    duration: 100,
                    yoyo: true,
                    repeat: 3,
                    onComplete: () => {
                        this.player.alpha = 1; // Reset the alpha value to 1
                    }
                });
            }
        });


        // Handle collision between enemy projectiles and the player (queued processing)
        this.physics.world.colliders.getActive().forEach((collider) => {
            if (collider.bodyA === this.player.body || collider.bodyB === this.player.body) {
                collider.collideCallback(collider.bodyA === this.player.body ? collider.bodyB.gameObject : collider.bodyA.gameObject);
            }
        });
    }



    /* END-USER-CODE */
}
