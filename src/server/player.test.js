const Player = require('./player');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

describe('Player', () => {
  describe('update', () => {
    it('should gain score each second', () => {
      const player = new Player('123', 'guest');
      const initialScore = player.score;

      player.update(1);

      expect(player.score).toBeGreaterThan(initialScore);
    });
    it('should never have its health go above the max health', () => {
      const player = new Player('123', 'guest');

      player.takeBulletDamage();
      player.update(5);

      expect(player.hp).toBeLessThan(Constants.PLAYER_MAX_HP);
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

      expect(player.hp).toBe(
        initialHp - Constants.BULLET_DAMAGE + Constants.PLAYER_HEALTH_REGEN
      );
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
    it('include hp, direction, and isCollided in serialization', () => {
      const player = new Player('123', 'guest');

      expect(player.serializeForUpdate()).toEqual(
        expect.objectContaining({
          hp: expect.any(Number),
          direction: expect.any(Number),
          isCollided: expect.any(Boolean)
        })
      );
    });
  });
});
