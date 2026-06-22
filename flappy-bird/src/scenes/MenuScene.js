import Phaser from "phaser";

class MenuScene extends Phaser.Scene {
  constructor(config) {
    super("MenuScene");

    this.config = config;
  }

  preload() {}

  create(data) {
    this.add.image(0, 0, "sky").setOrigin(0, 0);

    this.add
      .text(
        this.config.game_width / 2,
        this.config.game_height / 2,
        "Flappy Bird",
        { fontSize: "60px", color: "#ff0000" },
      )
      .setOrigin(0.5)
      .setDepth(1);

    this.add
      .text(
        this.config.game_width / 2,
        this.config.game_height / 2 + 100,
        "Click to Start",
        { fontSize: "32px", color: "#000" },
      )
      .setOrigin(0.5)
      .setDepth(1)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("PlayScene");
      });
  }
}

export default MenuScene;
