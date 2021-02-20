import { getAsset } from './assets';
import { getCurrentState } from './state';
import { debounce } from 'throttle-debounce';
import escape from 'lodash/escape';

const Constants = require('../shared/constants');
const { PLAYER_RADIUS, PLAYER_MAX_HP, MAP_SIZE } = Constants;

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others, bullets } = getCurrentState();
  if (!me) {
    return;
  }

  renderBackground(me.x, me.y);

  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(
    canvas.width / 2 - me.x,
    canvas.height / 2 - me.y,
    MAP_SIZE,
    MAP_SIZE
  );

  bullets.forEach(renderBullet.bind(null, me));
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
  renderMiniMap(
    (me.x * canvas.height) / MAP_SIZE,
    (me.y * canvas.height) / MAP_SIZE
  );
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  // console.log(`x: ${backgroundX} y: ${backgroundY}`);
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderMiniMap(playerX, playerY) {
  const miniMapStart = [
    canvas.width - canvas.height * Constants.MINIMAP_SIZE_PERCENTAGE - 10,
    canvas.height - canvas.height * Constants.MINIMAP_SIZE_PERCENTAGE - 10
  ];

  const newPlayerLoc = [
    miniMapStart[0] + playerX * Constants.MINIMAP_SIZE_PERCENTAGE,
    miniMapStart[1] + playerY * Constants.MINIMAP_SIZE_PERCENTAGE
  ];

  const miniMapCenter = [
    miniMapStart[0] + (canvas.height * Constants.MINIMAP_SIZE_PERCENTAGE) / 2,
    miniMapStart[1] + (canvas.height * Constants.MINIMAP_SIZE_PERCENTAGE) / 2
  ];

  const backgroundGradient = context.createRadialGradient(
    miniMapCenter[0],
    miniMapCenter[1],
    (MAP_SIZE / 10) * Constants.MINIMAP_SIZE_PERCENTAGE,
    miniMapCenter[0],
    miniMapCenter[1],
    (MAP_SIZE / 2) * Constants.MINIMAP_SIZE_PERCENTAGE
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.strokeStyle = 'black';
  context.lineWidth = '5';
  context.fillStyle = backgroundGradient;

  context.rect(
    miniMapStart[0],
    miniMapStart[1],
    canvas.height * Constants.MINIMAP_SIZE_PERCENTAGE,
    canvas.height * Constants.MINIMAP_SIZE_PERCENTAGE
  );
  context.stroke();
  context.fill();

  //Draw a dot for where the player is.
  context.fillStyle = '#ff0000';
  context.beginPath();
  context.strokeStyle = 'white';
  context.lineWidth = '5';
  ///context.fillRect(newPlayerLoc[0] - 4, newPlayerLoc[1] - 4, 8, 8);
  context.arc(newPlayerLoc[0], newPlayerLoc[1], 3, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
}
// let name;
function renderPlayer(me, player) {
  const { x, y, direction } = player;

  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  let playerImage;
  if (player.isColliding) {
    playerImage = getAsset('shipColliding.svg');
  } else {
    // Player is not colliding
    if (player.isBoosting) {
      playerImage = getAsset('shipBoosting.svg');
    } else {
      playerImage = getAsset('ship.svg');
    }
  }
  context.drawImage(
    playerImage,
    -player.radius,
    -player.radius,
    player.radius * 2,
    player.radius * 2
  );

  context.restore();

  // Show the players name

  context.fillStyle = 'white';
  context.textAlign = 'center';

  context.font = '15px monospace';
  context.fillText(player.username, canvasX, canvasY - PLAYER_RADIUS - 6);

  // If the player health is not equal to the maximum health, then draw the health bar
  if (player.hp !== player.maxHp) {
    // Draw health bar
    context.fillStyle = 'white';
    context.fillRect(
      canvasX - player.radius,
      canvasY + player.radius + 8,
      player.radius * 2,
      2
    );
    context.fillStyle = 'red';
    context.fillRect(
      canvasX - player.radius + (player.maxHp * 2 * player.hp) / PLAYER_MAX_HP,
      canvasY + player.maxHp + 8,
      player.maxHp * 2 * (1 - player.hp / player.maxHp),
      2
    );
  }
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - Constants.BULLET_RADIUS,
    canvas.height / 2 + y - me.y - Constants.BULLET_RADIUS,
    Constants.BULLET_RADIUS * 2,
    Constants.BULLET_RADIUS * 2
  );
}

function renderMainMenu() {
  const t = Date.now() / 7000;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}
let renderInterval = setInterval(renderMainMenu, 1000 / 60);

export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
