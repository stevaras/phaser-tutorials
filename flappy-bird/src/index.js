import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 200 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

new Phaser.Game(config);

let bird = null;
let upperPipe = null;
let lowerPipe = null;
let VELOCITY = 200;
let flopVelocity = 200;
let GAME_OVER = false;
let pipesVerticalDistanceRange = [150, 250];
let pipeVerticalDistance = Phaser.Math.Between(...pipesVerticalDistanceRange);
let pipeVerticalPosition = Phaser.Math.Between(
  0 + 20,
  config.height - 20 - pipeVerticalDistance,
);
let pipeHorizontalRange = Phaser.Math.Between(250, 400);
let pipeHorizontalDistance = 400;
let PIPES_TO_RENDER = 4;

let initialBirdPosition = {
  x: config.width * 0.1,
  y: config.height / 2,
};

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  // here the middle of the image is at the half of both dimensions because default origin is 0.5, 0.5
  // this.add.image(config.width / 2, config.height / 2, "sky");
  // here we set the origin to the top left corner, so the image starts at the top left corner of the canvas
  this.add.image(0, 0, "sky").setOrigin(0, 0);

  bird = this.physics.add
    .sprite(config.width * 0.1, config.height / 2, "bird")
    .setOrigin(0)
    .setGravityY(300);

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    let _pipeHorizontalDistance = pipeHorizontalDistance * (i + 1);
    console.log(_pipeHorizontalDistance);
    let _pipeVerticalDistance = Phaser.Math.Between(
      ...pipesVerticalDistanceRange,
    );
    let _pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      config.height - 20 - _pipeVerticalDistance,
    );

    upperPipe = this.physics.add
      .sprite(_pipeHorizontalDistance, _pipeVerticalPosition, "pipe")
      .setOrigin(0, 1)
      .setVelocityX(-VELOCITY);
    lowerPipe = this.physics.add
      .sprite(
        _pipeHorizontalDistance,
        upperPipe.y + _pipeVerticalDistance,
        "pipe",
      )
      .setOrigin(0, 0)
      .setVelocityX(-VELOCITY);
  }

  // upperPipe = this.physics.add
  //   .sprite(400, pipeVerticalPosition, "pipe")
  //   .setOrigin(0, 1)
  //   .setVelocityX(-VELOCITY);
  // lowerPipe = this.physics.add
  //   .sprite(400, upperPipe.y + pipeVerticalPosition, "pipe")
  //   .setOrigin(0, 0)
  //   .setVelocityX(-VELOCITY) ;

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown-SPACE", flap);
}

function flap() {
  bird.body.setVelocityY(-flopVelocity);
}

function restartPlayerPosition() {
  bird.body.setVelocityY(0);

  // bird.body.position = initialBirdPosition;
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
}

// 60fps
// 60 times per second, 60 * 16.67ms = 1000ms = 1s
function update(time, delta) {
  if (GAME_OVER) {
    return;
  }

  if (bird.body.y >= config.height - bird.height) {
    // bird.body.setGravityY(0);
    // this.physics.world.gravity.y = 0;

    // GAME_OVER = true;
    restartPlayerPosition();
  }

  // if (bird.body.x >= config.width - bird.width) {
  //   bird.body.setVelocityX(-VELOCITY);
  // }
  // if (bird.body.x <= 0) {
  //   bird.body.setVelocityX(VELOCITY);
  // }
}
