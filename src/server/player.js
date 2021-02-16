const ObjectClass = require("./object");
const Constants = require("../shared/constants");

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.MAX_PLAYER_HP;
    this.score = 0;
  }

  update(dt) {
    super.update(dt);

    // update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // The player should stay in the bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
  }
  serializerForUpdate() {
    return {
      ...this(super.serializerForUpdate()),
      direction: this.direction,
      hp: this.hp
    };
  }
}

module.exports = Player;
