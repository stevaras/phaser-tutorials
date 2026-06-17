import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.bird = null;

    this.pipesVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [200, 400];
    this.initialNumberOfPipes = 4;
    this.pipes = null;
    this.gameOver = false;
    this.config = config;

    this.velocity = 200;
    this.flopVelocity = 200;

    this.recycling = false;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.createBG();

    this.createBird();
    this.createPipes();
    this.createColliders();
    this.eventListeners();
  }

  createBG() {
    // here the middle of the image is at the half of both dimensions because default origin is 0.5, 0.5
    // this.add.image(config.width / 2, config.height / 2, "sky");
    // here we set the origin to the top left corner, so the image starts at the top left corner of the canvas
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(
        this.config.bird_start_position.x,
        this.config.bird_start_position.y,
        "bird",
      )
      .setOrigin(0)
      .setGravityY(300)
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

    // pipes.setVelocityX(-VELOCITY);

    // pipes.getChildren().forEach((pipe) => {
    //   pipe.setVelocityY(-VELOCITY);
    // });
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
    this.bird.body.setVelocityY(-this.flopVelocity);
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
}

export default PlayScene;
