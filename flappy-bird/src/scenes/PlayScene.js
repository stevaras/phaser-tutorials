import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.pipesVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [200, 400];
    this.initialNumberOfPipes = 4;
    this.config = config;
    this.velocity = 150;
    this.flopVelocity = 200;
    this.birdGravity = 350;
    this.gamesPlayed = 0;
  }

  init(config) {
    this.bird = null;
    this.score = 0;
    this.pipes = null;
    this.gameOver = false;
    this.isManuallyPaused = false;
    this.recycling = false;
    this.scoreText = null;
    this.bestScore = +localStorage.getItem("bestScore") || 0;

    if (config) {
      this.score = config.score || 0;
      this.bestScore = config.bestScore || this.bestScore;
      this.gamesPlayed = config.gamesPlayed || this.gamesPlayed;
    }
  }

  preload() {}

  create() {
    this.createBG();
    this.createBird(
      this.config.bird_start_position.x,
      this.config.bird_start_position.y,
    );
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.eventListeners();
    this.createPauseButton();
  }

  createScore() {
    this.scoreText = this.add
      .text(16, 16, `Score: ${this.score}`, {
        fontSize: "32px",
        color: "#000",
      })
      .setDepth(1);

    if (this.gamesPlayed > 0) {
      this.add
        .text(16, 50, `Best Score: ${this.bestScore}`, {
          fontSize: "16px",
          color: "#000",
        })
        .setDepth(1);

      this.add
        .text(16, 70, `Games Played: ${this.gamesPlayed}`, {
          fontSize: "16px",
          color: "#000",
        })
        .setDepth(1);
    }
  }

  // handlePause() {
  //   if (!this.physics.world.isPaused) {
  //     this.physics.pause();
  //   } else {
  //     this.physics.resume();
  //   }
  // }

  createPauseButton() {
    const pauseButton = this.add.image(
      this.config.game_width - 10,
      this.config.game_height - 10,
      "pause",
    );
    pauseButton.setOrigin(1);
    pauseButton.setScale(3);
    pauseButton.setInteractive();
    pauseButton.on("pointerdown", () => {
      if (!this.physics.world.isPaused) {
        // this.handlePause();
        this.scene.launch("PauseScene", { parentScene: this });
      }
    });
    this.input.keyboard.on("keydown-P", () => {
      if (!this.physics.world.isPaused) {
        // this.handlePause();
        this.scene.launch("PauseScene", { parentScene: this });
      }
    });
    this.input.keyboard.on("keydown-ESC", () => {
      console.log("Escape key pressed");

      // this.handlePause();
      this.scene.start("MenuScene");
    });
  }

  createBG() {
    // here the middle of the image is at the half of both dimensions because default origin is 0.5, 0.5
    // this.add.image(config.width / 2, config.height / 2, "sky");
    // here we set the origin to the top left corner, so the image starts at the top left corner of the canvas
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird(x, y) {
    this.bird = this.physics.add
      .sprite(x, y, "bird")
      .setOrigin(0)
      .setGravityY(this.birdGravity)
      .setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    let lastPipeHorizontalDistance = 0;
    for (let i = 0; i < this.initialNumberOfPipes; i++) {
      let _pipeHorizontalDistance = this.getPipeHorizontalDistance(
        lastPipeHorizontalDistance,
      );
      lastPipeHorizontalDistance = _pipeHorizontalDistance;
      this.placePipe(_pipeHorizontalDistance);
    }
  }

  createColliders() {
    this.physics.add.collider(
      this.bird,
      this.pipes,
      () => {
        this.gameOverHandler();
      },
      null,
      this,
    );
  }

  eventListeners() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }

  // 60fps
  // 60 times per second, 60 * 16.67ms = 1000ms = 1s
  update(time, delta) {
    this.checkGameStatus();

    if (!this.recycling) {
      this.recyclePipes();
    }
  }

  gameOverHandler() {
    this.gameOver = true;

    // this.restartPlayerPosition();
    this.physics.pause();
    this.bird.setTint(0xee4824);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.bestScore = Math.max(this.bestScore, this.score);
        localStorage.setItem("bestScore", String(this.bestScore));

        this.score = 0;
        this.scoreText.setText(`Score: ${this.score}`);

        this.gameOver = false;
        this.gamesPlayed += 1;
        this.scene.restart();
      },
      loop: false,
    });
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.game_height ||
      this.bird.getBounds().top <= 0
    ) {
      this.gameOverHandler();
    }
  }

  flap() {
    if (!this.gameOver && !this.getManuallyPaused()) {
      this.bird.body.setVelocityY(-this.flopVelocity);
    }
  }

  restartPlayerPosition() {
    this.bird.body.setVelocityY(0);

    // this.bird.body.position = initialBirdPosition;
    this.bird.x = this.config.bird_start_position.x;
    this.bird.y = this.config.bird_start_position.y;
  }

  placePipe(initialDistance) {
    let _pipeVerticalDistance = Phaser.Math.Between(
      this.pipesVerticalDistanceRange[0],
      this.pipesVerticalDistanceRange[1],
    );
    let _pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.game_height - 20 - _pipeVerticalDistance,
    );

    const upperPipe = this.pipes
      .create(initialDistance, _pipeVerticalPosition, "pipe")
      .setOrigin(0, 1)
      .setImmovable(true)
      .setVelocityX(-this.velocity);

    const lowerPipe = this.pipes
      .create(initialDistance, upperPipe.y + _pipeVerticalDistance, "pipe")
      .setOrigin(0, 0)
      .setImmovable(true)
      .setVelocityX(-this.velocity);
  }

  recyclePipes() {
    let firstPipe = this.pipes.getFirst(true);

    if (firstPipe.x < -firstPipe.width && !this.recycling) {
      console.log("Recycling");

      this.recycling = true;

      let lastPipe = this.pipes.getLast(true);
      let lastPipeDistance = lastPipe.x;

      this.pipes.killAndHide(firstPipe);
      // kill also second pipe because it's a pair of pipes, so we need to kill the second pipe too
      let secondPipe = this.pipes.getFirst(true);
      this.pipes.killAndHide(secondPipe);
      firstPipe.setActive(false);
      secondPipe.setActive(false);
      this.increaseScore();
      this.placePipe(this.getPipeHorizontalDistance(lastPipeDistance));
      this.recycling = false;
    }
  }

  getPipeHorizontalDistance(lastPipeHorizontalDistance) {
    let _pipeHorizontalDistance =
      lastPipeHorizontalDistance +
      Phaser.Math.Between(
        this.pipeHorizontalDistanceRange[0],
        this.pipeHorizontalDistanceRange[1],
      );
    return _pipeHorizontalDistance;
  }

  increaseScore() {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  getManuallyPaused() {
    return this.isManuallyPaused;
  }

  setManuallyPaused(value) {
    this.isManuallyPaused = value;
  }
}

export default PlayScene;
