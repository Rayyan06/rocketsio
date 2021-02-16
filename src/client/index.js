import { startRendering, stopRendering } from "./render";
import { downloadAssets } from "./assets";

import "./css/main.css";

const playMenu = document.getElementById("play-menu");
const playButton = document.getElementById("play-button");
const usernameInput = document.getElementById("username-input");

Promise.all([downloadAssets()]).then(() => {
  playMenu.classList.remove("hidden");
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    //play(usernameInput.value);
    playMenu.classList.add("hidden");
    //initState();
    //startCapturingInput();
    startRendering();
    //setLeaderboardHidden(false);
  };
});
