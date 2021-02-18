const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.isColliding = false;
  }

  update(dt) {
    super.update(dt);

    // update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Health regen
    this.hp += dt * Constants.PLAYER_HEALTH_REGEN;

    if (this.hp > Constants.PLAYER_MAX_HP) {
      this.hp = Constants.PLAYER_MAX_HP;
    }

    // The player should stay in the bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    this.fireCooldown -= dt;

    if (this.isColliding) {
      this.onPlayerCollision();
    }
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }
    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }
  onPlayerCollision() {
    this.hp -= Constants.PLAYER_DAMAGE;
  }
  serializeForUpdate() {
    return {
      ...super.serializeForUpdate(),
      direction: this.direction,
      hp: this.hp,
      isColliding: this.isColliding
    };
  }
}

module.exports = Player;
