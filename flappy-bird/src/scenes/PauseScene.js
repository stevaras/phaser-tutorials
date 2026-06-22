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

    this.add
      .text(
        this.config.game_width / 2,
        this.config.game_height / 2 + 50,
        "Press any key to resume",
        { fontSize: "16px", color: "#000" },
      )
      .setOrigin(0.5)
      .setDepth(1);

    this.add
      .text(
        this.config.game_width / 2,
        this.config.game_height / 2 + 150,
        "Press escape to exit",
        { fontSize: "32px", color: "#ff0000" },
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
    this.input.keyboard.on("keydown", (ctx) => {
      if (ctx.key !== "Escape") {
        this.handleUnpause(parentScene);
        return;
      }

      this.handleExit(parentScene);
    });
    this.input.on("pointerdown", () => {
      this.handleUnpause(parentScene);
    });
  }

  handlePause(scene) {
    scene.physics.pause();
    scene.setManuallyPaused(true);
  }

  handleExit(scene) {
    scene.physics.resume();
    scene.setManuallyPaused(false);
    this.scene.start("MenuScene");
  }

  handleUnpause(scene) {
    setTimeout(() => {
      // to prevent the click event that triggered the unpause from also triggering a flap in the play scene, we can add a small delay before resuming the game
      scene.physics.resume();
      scene.setManuallyPaused(false);
      this.scene.stop();
    }, 50);
  }
}

export default PauseScene;
