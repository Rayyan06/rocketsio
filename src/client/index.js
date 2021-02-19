import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

import './css/main.css';
import './css/bootstrap-reboot.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const gameOver = document.getElementById('game-over');

function playGame() {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    playMenu.classList.add('hidden');

    play(usernameInput.value);
    initState();
    startCapturingInput();
    startRendering();
    setLeaderboardHidden(false);
  };
}
Promise.all([connect(onGameOver), downloadAssets()]).then(() => {
  playGame();
});

function onGameOver(finalScore) {
  stopCapturingInput();
  stopRendering();
  // playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
  gameOver.classList.remove('hidden');
  const playAgainButton = document.getElementById('play-again');
  const gameOverMessage = document.getElementById('game-over-message');

  if (finalScore < 10) {
    gameOverMessage.innerText = 'You just suck you idiot. Try again!';
  } else if (finalScore < 20) {
    gameOverMessage.innerText = "You are messed up. Can't you be better?";
  } else if (finalScore < 50) {
    gameOverMessage.innerText = 'Moronic Stupido. Not tooo bad';
  } else if (finalScore < 100) {
    gameOverMessage.innerText = 'Ugh, less than 100? Keep trying.';
  } else if (finalScore < 200) {
    gameOverMessage.innerText = "Getting somewhere. Maybe you'll be good soon";
  } else if (finalScore < 500) {
    gameOverMessage.innerText = 'Nice one. Try going for 1000';
  } else if (finalScore < 1000) {
    gameOverMessage.innerText = 'Wow, you are getting good! So close to 1000!';
  } else if (finalScore < 1500) {
    gameOverMessage.innerText = 'YOU ARE INSANE POGCHAMP';
  } else if (finalScore < 2000) {
    gameOverMessage.innerText =
      'legend is that your best? try submitting it in the world record sheet';
  }
  gameOverMessage.innerText = 'Player ' + gameOverMessage.innerText;
  const finalScoreElement = document.getElementById('final-score');
  finalScoreElement.innerHTML = Math.round(finalScore);
  playAgainButton.onclick = () => {
    gameOver.classList.add('hidden');
    playGame();
  };
}
