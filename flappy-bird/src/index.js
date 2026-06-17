import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import { BIRD_POSITION, GAME_HEIGHT, GAME_WIDTH } from "./consts";
import PauseScene from "./scenes/PauseScene";

const SHARED_CONFIG = {
  game_width: GAME_WIDTH,
  game_height: GAME_HEIGHT,
  bird_start_position: BIRD_POSITION,
};

export const config = {
  type: Phaser.AUTO,
  width: SHARED_CONFIG.game_width,
  height: SHARED_CONFIG.game_height,
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 200 },
      debug: true,
    },
  },
  scene: [new PlayScene(SHARED_CONFIG), new PauseScene(SHARED_CONFIG)],
};

new Phaser.Game(config);
