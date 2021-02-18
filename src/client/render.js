import { getAsset } from './assets';
import { getCurrentState } from './state';
import { debounce } from 'throttle-debounce';
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
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
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

function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    player.isColliding ? getAsset('shipColliding.svg') : getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2
  );
  context.restore();

  // If the player health is not equal to the maximum health, then draw the health bar
  if (player.hp !== Constants.PLAYER_MAX_HP) {
    // Draw health bar
    context.fillStyle = 'white';
    context.fillRect(
      canvasX - PLAYER_RADIUS,
      canvasY + PLAYER_RADIUS + 8,
      PLAYER_RADIUS * 2,
      2
    );
    context.fillStyle = 'red';
    context.fillRect(
      canvasX - PLAYER_RADIUS + (PLAYER_RADIUS * 2 * player.hp) / PLAYER_MAX_HP,
      canvasY + PLAYER_RADIUS + 8,
      PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
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
