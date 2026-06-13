import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 5800,
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
let VELOCITY = 200;
let flopVelocity = 200;
let GAME_OVER = false;
// pipes related stuff
let pipesVerticalDistanceRange = [150, 250];
let pipeHorizontalDistanceRange = [200, 400];

let pipeHorizontalDistance = 400;
let PIPES_TO_RENDER = 3;
let pipes;
// ==== end of pipes related stuff

let initialBirdPosition = {
  x: 100,
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
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0)
    .setGravityY(300);

  pipes = this.physics.add.group();

  let lastPipeHorizontalDistance = 0;
  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    let _pipeHorizontalDistance = getPipeHorizontalDistance(
      lastPipeHorizontalDistance,
    );
    lastPipeHorizontalDistance = _pipeHorizontalDistance;
    placePipe.call(this, _pipeHorizontalDistance);
  }

  // pipes.setVelocityX(-VELOCITY);

  // pipes.getChildren().forEach((pipe) => {
  //   pipe.setVelocityY(-VELOCITY);
  // });

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown-SPACE", flap);
}
let recycling = false;

// 60fps
// 60 times per second, 60 * 16.67ms = 1000ms = 1s
function update(time, delta) {
  if (GAME_OVER) {
    return;
  }

  if (bird.body.y > config.height - bird.height || bird.body.y < 0) {
    // bird.body.setGravityY(0);
    // this.physics.world.gravity.y = 0;

    // GAME_OVER = true;
    restartPlayerPosition();
  }

  if (!recycling) {
    recyclePipes.call(this);
  }

  // if (bird.body.x >= config.width - bird.width) {
  //   bird.body.setVelocityX(-VELOCITY);
  // }
  // if (bird.body.x <= 0) {
  //   bird.body.setVelocityX(VELOCITY);
  // }
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

function placePipe(initialDistance) {
  let _pipeVerticalDistance = Phaser.Math.Between(
    pipesVerticalDistanceRange[0],
    pipesVerticalDistanceRange[1],
  );
  let _pipeVerticalPosition = Phaser.Math.Between(
    0 + 20,
    config.height - 20 - _pipeVerticalDistance,
  );

  const upperPipe = pipes
    .create(initialDistance, _pipeVerticalPosition, "pipe")
    .setOrigin(0, 1)
    .setVelocityX(-VELOCITY);

  const lowerPipe = pipes
    .create(initialDistance, upperPipe.y + _pipeVerticalDistance, "pipe")
    .setOrigin(0, 0)
    .setVelocityX(-VELOCITY);
}

function recyclePipes() {
  let firstPipe = pipes.getFirst(true);

  if (firstPipe.x < -firstPipe.width && !recycling) {
    recycling = true;

    let lastPipe = pipes.getLast(true);
    let lastPipeDistance = lastPipe.x;

    pipes.killAndHide(firstPipe);
    firstPipe.setActive(false);

    placePipe.call(this, getPipeHorizontalDistance(lastPipeDistance));
  } else if (firstPipe.x >= -firstPipe.width) {
    recycling = false;
  }
}

function getPipeHorizontalDistance(lastPipeHorizontalDistance) {
  let _pipeHorizontalDistance =
    lastPipeHorizontalDistance +
    Phaser.Math.Between(
      pipeHorizontalDistanceRange[0],
      pipeHorizontalDistanceRange[1],
    );
  return _pipeHorizontalDistance;
}
