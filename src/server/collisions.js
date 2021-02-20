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
        player.distanceTo(bullet) <= player.radius + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push({ bullet: bullet, player: player });
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
        player.distanceTo(otherPlayer) <= player.radius + otherPlayer.radius
      ) {
        collidedPlayers.push({ player: player, otherPlayer: otherPlayer });
        player.isColliding = true;
        break;
      } else {
        player.isColliding = false;
      }
    }
  }
  return collidedPlayers;
}

function applyFoodCollisions(players, foods) {
  const eatenFood = [];
  for (let i = 0; i < foods.length; i++) {
    // Look for a player who hit a food
    for (let j = 0; j < players.length; j++) {
      const food = foods[i];
      const player = players[j];
      if (player.distanceTo(food) <= player.radius + food.radius) {
        eatenFood.push({ player: player, food: food });
        player.eatFood(food);
        break;
      }
    }
  }
  return eatenFood;
}

module.exports = {
  applyBulletCollisions,
  applyPlayerCollisions,
  applyFoodCollisions
};
