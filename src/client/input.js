import { updateDirection, handleKeyPress } from './networking';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

function handleKeyDown(event) {
  const keyCode = event.keyCode;
  handleKeyPress(keyCode);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', handleKeyDown);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('touchmove', onTouchInput);
  window.removeEventListener('keydown', handleKeyDown);
}
