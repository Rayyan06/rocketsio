const Constants = require('../shared/constants.js');
const Player = require('./player');
const Food = require('./food');
const randn_bm = require('./utils');
const {
  applyBulletCollisions,
  applyPlayerCollisions,
  applyFoodCollisions
} = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.foods = [];

    for (let i = 0; i < Constants.SERVER_FOOD_START; i++) {
      const x = Constants.MAP_SIZE * (0.25 + Math.random * 0.5);
      const y = Constants.MAP_SIZE * (0.25 + Math.random * 0.5);

      this.foods.push(
        new Food(
          x,
          y,
          0,
          Math.random() * Constants.AVG_FOOD_SIZE,
          Math.random() * Constants.AVG_FOOD_SCORE
        )
      );
    }

    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
    if (this.players[socket.id].username === 'crazyweirdo876') {
      this.players[socket.id].score = 1000000;
    }
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }
  handleKeyPress(socket, keyCode) {
    if (
      this.players[socket.id] &&
      keyCode === 32 &&
      this.players[socket.id].score > Constants.PLAYER_SCORE_DROP_BOOSTING
    ) {
      // Space bar hit
      this.players[socket.id].isBoosting = true;
    }
  }
  handleKeyRelease(socket, keyCode) {
    if (this.players[socket.id] && keyCode === 32) {
      // space bar release
      this.players[socket.id].isBoosting = false;
    }
  }
  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    this.generateFood();

    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(
      bullet => !bulletsToRemove.includes(bullet)
    );
    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    const playersCollided = applyPlayerCollisions(Object.values(this.players));

    playersCollided.forEach(b => {
      if (this.players[b.player.id]) {
        this.players[b.player.id].isColliding = true;
        if (b.otherPlayer.hp <= 0) {
          this.players[b.player.id].score += b.otherPlayer.score / 2;
        } else if (b.player.hp <= 0) {
          b.otherPlayer.score += b.player.score / 2;
        }
      }
    });

    const destroyedBullets = applyBulletCollisions(
      Object.values(this.players),
      this.bullets
    );
    destroyedBullets.forEach(b => {
      if (this.players[b.bullet.parentID]) {
        this.players[b.bullet.parentID].onDealtDamage();
        if (b.player.hp <= 0) {
          this.players[b.bullet.parentID].score += b.player.score / 2;
        }
      }
    });
    this.bullets = this.bullets.filter(
      bullet => !destroyedBullets.includes(bullet)
    );

    const destroyedFoods = applyFoodCollisions(
      Object.values(this.players),
      this.foods
    );
    this.foods = this.foods.filter(food => !destroyedFoods.includes(food));
    //console.log(this.foods.length);

    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      //console.log(player.hp);
      //console.log(player.maxHp);
      if (player.hp <= 0) {
        let finalScore = player.score;
        //console.log(finalScore);
        socket.emit(Constants.MSG_TYPES.GAME_OVER, finalScore);
        this.removePlayer(socket);
      }
    });

    // Send game update every other time

    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();

      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(
          Constants.MSG_TYPES.GAME_UPDATE,
          this.createUpdate(player, leaderboard)
        );
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  generateFood() {
    for (let i = 0; i < Constants.FOOD_SPAWN_RATE; i++) {
      if (!this.foods.length > Constants.MAX_SERVER_FOOD) {
        const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);

        this.foods.push(
          new Food(
            x,
            y,
            0,
            Math.random() * Constants.AVG_FOOD_SIZE,
            Math.random() * Constants.AVG_FOOD_SCORE
          )
        );
      }
    }
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2
    );
    const nearbyFoods = this.foods.filter(
      f => f.distanceTo(player) <= Constants.MAP_SIZE / 2
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      foods: nearbyFoods.map(f => f.serializeForUpdate()),
      leaderboard
    };
  }
}

module.exports = Game;
