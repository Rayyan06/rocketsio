module.exports = Object.freeze({
  PLAYER_RADIUS: 30,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  BULLET_SPEED: 500,
  PLAYER_FIRE_COOLDOWN: 5,
  BULLET_DAMAGE: 10,
  SCORE_PER_SECOND: 1,
  SCORE_BULLET_HIT: 5,
  BULLET_RADIUS: 10,

  MAP_SIZE: 5000,
  MSG_TYPES: {
    JOIN_GAME: "join_game",
    GAME_UPDATE: "update",
    INPUT: "input",
    GAME_OVER: "dead"
  }
});
