const {
  applyBulletCollisions,
  applyPlayerCollisions
} = require('./collisions');
const Constants = require('../shared/constants');
const Player = require('./player');
const Bullet = require('./bullet');

describe('applyPlayerCollisions', () => {
  it('should not collide when outside radius', () => {
    const distanceFromPlayer = Constants.PLAYER_RADIUS * 2 + 1;
    const players = [
      new Player('1', 'guest1', 1000, 40),
      new Player('2', 'guest2', 1000 + distanceFromPlayer, 40),
      new Player('3', 'guest3', 1000, 40 - distanceFromPlayer)
    ];

    const result = applyPlayerCollisions(players);
    expect(result).toHaveLength(0);
  });
  it('should not collide with itself', () => {
    const playerId = '1';
    const player = new Player(playerId, 'guest', 40, 40);

    const result = applyPlayerCollisions([player]);
    expect(result).toHaveLength(0);
  });
  it('should apply damage when player collides with another player', () => {
    const player = new Player('1', 'guest', 40, 40);
    const otherPlayer = new Player(
      '2',
      'guest2',
      40 + Constants.PLAYER_RADIUS * 2,
      40
    );

    jest.spyOn(player, 'onPlayerCollision');

    const result = applyPlayerCollisions([player, otherPlayer]);
    expect(result).toHaveLength(2);
    player.update(1);
    expect(player.onPlayerCollision).toHaveBeenCalledTimes(1);
  });
});
describe('applyBulletCollisions', () => {
  it('should not collide when outside radius', () => {
    const distanceFromPlayer =
      Constants.BULLET_RADIUS + Constants.PLAYER_RADIUS + 1;
    const players = [
      new Player('1', 'guest1', 1000, 40),
      new Player('2', 'guest2', 2000, 2000)
    ];
    const bullets = [
      new Bullet('2', 1000 - distanceFromPlayer, 40, 0),
      new Bullet('2', 1000 + distanceFromPlayer, 40, 0)
    ];

    const result = applyBulletCollisions(players, bullets);
    expect(result).toHaveLength(0);
  });

  it('should not collide with own player', () => {
    const playerId = '1234';
    const player = new Player(playerId, 'guest', 40, 40);
    const bullet = new Bullet(playerId, 40, 40, 0);

    const result = applyBulletCollisions([player], [bullet]);
    expect(result).toHaveLength(0);
  });

  it('should apply damage when bullet collides with player', () => {
    const player = new Player('1', 'guest', 40, 40);
    const bullet = new Bullet(
      '2',
      40,
      40 + Constants.BULLET_RADIUS + player.radius,
      0
    );

    jest.spyOn(player, 'takeBulletDamage');

    const result = applyBulletCollisions([player], [bullet]).bullet;
    expect(result).toHaveLength(1);
    expect(result).toContain(bullet);
    expect(player.takeBulletDamage).toHaveBeenCalledTimes(1);
  });
});
