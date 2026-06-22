import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor(config) {
    super("PreloadScene");

    this.config = config;
  }

  preload() {
    // 1. Create the Progress Bar Graphics objects
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();

    // Draw the background box
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    // 2. Create loading text
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: { font: "20px monospace", color: "#ffffff" },
    });
    loadingText.setOrigin(0.5, 0.5);

    // 3. Create percentage text
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: "0%",
      style: { font: "18px monospace", color: "#ffffff" },
    });
    percentText.setOrigin(0.5, 0.5);

    // 4. Update the progress bar as assets load
    this.load.on("progress", (value) => {
      percentText.setText(parseInt(String(value * 100)) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      // 300 is the max width of the bar
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // 5. Clean up the scene once loading is complete
    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // --- Load your actual game assets here ---
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
  }

  create() {
    // show a progress bar or loading animation here if the assets take a long time to load

    this.scene.start("MenuScene");
  }
}

export default PreloadScene;
