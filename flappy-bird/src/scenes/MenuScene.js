import BaseScene from "./BaseScene.js";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);

    this.config = config;

    this.menu = [
      { scene: "PlayScene", text: "Start Game" },
      { scene: "SettingsScene", text: "Settings" },
      { scene: "HighScoresScene", text: "High Scores" },
      { scene: "CreditsScene", text: "Credits" },
    ];
  }

  preload() {}

  create() {
    super.create();
    this.createMenu();
    this.add
      .text(
        this.config.game_width / 2,
        this.config.game_height / 2,
        "Flappy Bird",
        { fontSize: "60px", color: "#ff0000" },
      )
      .setOrigin(0.5)
      .setDepth(1);

    // this.add
    //   .text(
    //     this.config.game_width / 2,
    //     this.config.game_height / 2 + 100,
    //     "Click to Start",
    //     { fontSize: "32px", color: "#000" },
    //   )
    //   .setOrigin(0.5)
    //   .setDepth(1)
    //   .setInteractive()
    //   .on("pointerdown", () => {
    //     this.scene.start("PlayScene");
    //   });
  }

  createMenu() {
    const menuItems = this.menu.map((item, index) => {
      const menuItem = this.add
        .text(
          this.config.game_width / 2,
          this.config.game_height / 2 + 100 + index * 50,
          item.text,
          { fontSize: "32px", color: "#000" },
        )
        .setOrigin(0.5)
        .setDepth(1)
        .setInteractive()
        .on("pointerdown", () => {
          this.scene.start(item.scene);
        });

      return menuItem;
    });
  }
}

export default MenuScene;
