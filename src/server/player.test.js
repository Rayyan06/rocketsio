const Player = require('./player');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

describe('Player', () => {
  describe('update', () => {
    it('should gain score each second when it is not boosting', () => {
      const player = new Player('123', 'guest');
      const initialScore = player.score;

      player.update(1);

      expect(player.score).toBeGreaterThan(initialScore);
    });
    it('should lose score each second when it is boosting', () => {
      const player = new Player('123', 'guest');

      player.score = 100;
      const initialScore = player.score;

      player.isBoosting = true;
      player.update(1);

      expect(player.score).toBeLessThan(initialScore);
    });
    it('should never have its health go above the max health', () => {
      const player = new Player('123', 'guest');

      player.takeBulletDamage();
      player.update(5);

      expect(player.hp).toBeLessThanOrEqual(player.maxHp);
    });
    it('should fire bullet on update', () => {
      const player = new Player('123', 'guest');

      expect(player.update(Constants.PLAYER_FIRE_COOLDOWN / 3)).toBeInstanceOf(
        Bullet
      );
    });
    it('should not fire bullet during cooldown', () => {
      const player = new Player('123', 'guest');

      player.update(Constants.PLAYER_FIRE_COOLDOWN / 3);

      expect(player.update(Constants.PLAYER_FIRE_COOLDOWN / 3)).toBe(null);
    });
  });
  describe('takeBulletDamage', () => {
    it('should take damage when hit', () => {
      const player = new Player('123', 'guest');

      const initialHp = player.hp;

      player.takeBulletDamage();

      expect(player.hp).toBe(initialHp - Constants.BULLET_DAMAGE);
    });
  });

  describe('onDealtDamage', () => {
    it('should increment score when dealing damage', () => {
      const player = new Player('123', 'guest');

      const initialScore = player.score;

      player.onDealtDamage();

      expect(player.score).toBeGreaterThan(initialScore);
    });
  });

  describe('serializeForUpdate', () => {
    it('include hp, direction in serialization', () => {
      const player = new Player('123', 'guest');

      expect(player.serializeForUpdate()).toEqual(
        expect.objectContaining({
          hp: expect.any(Number),
          direction: expect.any(Number)
        })
      );
    });
  });
});
