import Phaser from "phaser";

class PauseScene extends Phaser.Scene {
  constructor(config) {
    super("PauseScene");

    this.config = config;
  }

  create(data) {
    const { parentScene } = data;

    this.add
      .text(
        this.config.game_width / 2,
        this.config.game_height / 2,
        "Game Paused",
        { fontSize: "60px", color: "#000" },
      )
      .setOrigin(0.5)
      .setDepth(1);

    // need to add some blur effect or dark overlay to indicate the game is paused
    this.add.rectangle(
      this.config.game_width / 2,
      this.config.game_height / 2,
      this.config.game_width,
      this.config.game_height,
      0x000000,
      0.3,
    );

    this.handlePause(parentScene);

    // on any key press, resume the parent scene and stop the pause scene
    this.input.keyboard.on("keydown", () => {
      this.handleUnpause(parentScene);
    });
    this.input.on("pointerdown", () => {
      this.handleUnpause(parentScene);
    });
  }

  handlePause(scene) {
    scene.physics.pause();
  }

  handleUnpause(scene) {
    scene.physics.resume();
    this.scene.stop();
  }
}

export default PauseScene;
