import "./style.css";
import Phaser from "phaser";
// elements
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const replayButton = document.getElementById("replay");

const sizes = {
  width: 500,
  height: 500,
};
const gravitySpeed = 300;
const totalTimeInMillisecond = 60000;
class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.bg;
    this.basket;
    this.apple;
    this.cursor;
    this.appleSpeed = gravitySpeed + 50;
    this.point = 0;
    this.scoreText;
    this.timerText;
    this.timerEvent;
    this.bgMusic;
    this.coinMusic;
    this.moneyEmitter;
  }
  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("basket", "assets/basket.png");
    this.load.image("apple", "assets/apple.png");
    this.load.audio("coin", "assets/coin.mp3");
    this.load.audio("bgMusic", "assets/bgMusic.mp3");
    this.load.image("money", "/assets/money.png");
  }
  create() {
    // background and coin music load
    this.bgMusic = this.sound.add("bgMusic");
    this.coinMusic = this.sound.add("coin");
    this.bgMusic.play();
    // background image load
    this.bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    // basket image load
    this.basket = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.basket
      .setSize(
        this.basket.width - this.basket.width / 4,
        this.basket.height / 6
      )
      .setOffset(
        this.basket.width / 10,
        this.basket.height - this.basket.height / 10
      );
    this.basket.setImmovable(true);
    this.basket.body.allowGravity = false;
    this.basket.setCollideWorldBounds(true);
    // apple image load
    this.apple = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.apple.setMaxVelocity(0, gravitySpeed);
    // setup collider
    this.physics.add.collider(
      this.basket,
      this.apple,
      this.targetHit,
      null,
      this
    );
    // setup score and timer text
    this.scoreText = this.add
      .text(16, 16, `Score: ${this.point}`, {
        fontSize: "24px",
        fill: "	#A020F0",
      })
      .setOrigin(0, 0);
    this.timerText = this.add
      .text(sizes.width - 16, 16, `Time: ${0}`, {
        fontSize: "24px",
        fill: "#A020F0",
      })
      .setOrigin(1, 0);
    // setup timer event;
    this.timerEvent = this.time.delayedCall(
      totalTimeInMillisecond,
      this.gameOver,
      [],
      this
    );
    // setup money emitter
    this.moneyEmitter = this.add.particles(0, 0, "money", {
      speed: 300,
      gravityY: gravitySpeed - 200,
      scale: 0.04,
      duration: 100,
      emitting: false,
      quantity: 1,
    });
    this.moneyEmitter.startFollow(
      this.basket,
      this.basket.width / 2,
      this.basket.height / 2,
      true
    );
    // setup cursor;
    this.cursor = this.input.keyboard.createCursorKeys();
    // event listeners;
    playButton.addEventListener("click", () => this.startGame());
    pauseButton.addEventListener("click", () => this.pauseGame());
    resumeButton.addEventListener("click", () => this.resumeGame());
    replayButton.addEventListener("click", () => this.replayGame());
    this.scene.pause();
  }
  update() {
    if (this.isPaused) return;
    this.timeRemaining = this.timerEvent.getRemainingSeconds();
    this.timerText.setText(
      `Time: ${Math.round(this.timeRemaining).toString()}`
    );
    if (this.apple.y >= sizes.height) {
      this.apple.setY(0);
      this.apple.setX(Math.random() * (sizes.width - this.apple.width));
    }
    const { left, right } = this.cursor;
    if (left.isDown) {
      this.basket.setVelocityX(-this.appleSpeed);
    } else if (right.isDown) {
      this.basket.setVelocityX(this.appleSpeed);
    } else {
      this.basket.setVelocityX(0);
    }
  }
  targetHit() {
    this.moneyEmitter.start();
    this.coinMusic.play();
    this.apple.setY(0);
    this.apple.setX(Math.random() * (sizes.width - this.apple.width));
    this.point++;
    this.scoreText.setText(`Score: ${this.point}`);
  }
  startGame() {
    this.isPaused = false;
    this.scene.resume();
  }

  pauseGame() {
    this.isPaused = true;
    this.scene.pause();
  }

  resumeGame() {
    this.isPaused = false;
    this.scene.resume();
  }
  replayGame() {
    this.isPaused = false;
    this.scene.restart();
  }
  gameOver() {
    this.scene.stop();
    // this.sys.game.destroy(true);
  }
}
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: phaserCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: gravitySpeed },
      debug: false,
    },
  },
  scene: [GameScene],
};
const game = new Phaser.Game(config);
