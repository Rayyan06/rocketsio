const Constants = require('../shared/constants');

// Return an array on bullets to be destroyed.
function applyBulletCollisions(players, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player who did not break the bullet to collide with the bullet.
    // When we find one, break
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <=
          Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}

function applyPlayerCollisions(players) {
  const collidedPlayers = [];
  for (let i = 0; i < players.length; i++) {
    // Look for a player who collided with another one
    for (let j = 0; j < players.length; j++) {
      const player = players[i];
      const otherPlayer = players[j];
      if (
        player.id !== otherPlayer.id &&
        player.distanceTo(otherPlayer) <= Constants.PLAYER_RADIUS * 2
      ) {
        collidedPlayers.push(player);
        player.isColliding = true;
        break;
      } else {
        player.isColliding = false;
      }
    }
  }
}

module.exports = { applyBulletCollisions, applyPlayerCollisions };
