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
    this.isBoosting = false;
    this.radius = Constants.PLAYER_RADIUS;
    this.maxHp = Constants.PLAYER_MAX_HP;
  }

  update(dt) {
    super.update(dt);

    // acceleration

    this.speed += dt * Constants.PLAYER_ACCELERATION;
    this.radius = Constants.PLAYER_RADIUS + 2 * Math.log(this.score);
    this.maxHp = Constants.PLAYER_MAX_HP;

    if (this.isBoosting) {
      if (this.score > Constants.PLAYER_SCORE_DROP_BOOSTING) {
        this.score -= dt * Constants.PLAYER_SCORE_DROP_BOOSTING;
      } else {
        this.isBoosting = false;
      }
      if (this.speed > Constants.PLAYER_BOOST_SPEED) {
        this.speed = Constants.PLAYER_BOOST_SPEED;
      }
    } else {
      if (this.speed > Constants.PLAYER_SPEED) {
        this.speed = Constants.PLAYER_SPEED;
      }
    }

    // update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Health regen
    this.hp += dt * Constants.PLAYER_HEALTH_REGEN;

    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
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
      isColliding: this.isColliding,
      username: this.username,
      isBoosting: this.isBoosting,
      radius: this.radius,
      maxHp: this.maxHp
    };
  }
}

module.exports = Player;
