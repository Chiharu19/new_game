import { failClickAnimation } from "./animation.js";

let tempTime;

const newLevel = (minutes, seconds) => {
  let level;

  if(minutes < 1){
    level = (seconds < 30) ? 1 : 2;
  } else if(minutes < 2){
    level = (seconds < 30) ? 3 : 4;
  } else if(minutes < 3 && seconds < 30) level = 5;
  else level = 6;

  return level;
}

const formatTime = function(unit, inMinutes) {
  if(inMinutes) return unit;
  else return unit < 10 ? '0' + unit : unit;
};

// updates the time in game
export function updateTime(stats, timeBoard, time){
  if(time.seconds === 59) {
    time.minutes += 1;
    time.seconds = 0;
  } else time.seconds += 1;

  if(time.minutes < 1){
    tempTime = `${time.seconds}`;
  } else{
    tempTime = `${time.minutes}:${formatTime(time.seconds, false)}`;
  }

  timeBoard.innerHTML = tempTime;

  stats.level = newLevel(time.minutes, time.seconds);
}

// adjusts game elements according to window size
export function adjustElementsSizes(parentElement){
  const hearts = document.querySelectorAll(`#hearts`);
  const time = document.querySelector('#time');
  const windowWidth = window.innerWidth;
  const parent = parentElement;
  
  let heartSize;
  let timeSize;
  
  if(windowWidth <= 480){
    parent.style.width = `${windowWidth*0.8}px`;
    parent.style.height = `${windowWidth*0.5}px`;
    heartSize = `${windowWidth*0.12}px`;
    timeSize = `${windowWidth*0.12}px`;
  } else if(windowWidth <= 768){
    parent.style.width = `${windowWidth*0.6}px`;
    parent.style.height = `${windowWidth*0.4}px`;
    heartSize = `${windowWidth*0.08}px`;
    timeSize = `${windowWidth*0.08}px`;
  } else if(windowWidth <= 1024){
    parent.style.width = `${windowWidth*0.5}px`;
    parent.style.height = `${windowWidth*0.3}px`;
    heartSize = `${windowWidth*0.05}px`;
    timeSize = `${windowWidth*0.05}px`;
  } else{
    parent.style.width = `${windowWidth*0.5}px`;
    parent.style.height = `${windowWidth*0.3}px`;
    heartSize = `${windowWidth*0.05}px`;
    timeSize = `${windowWidth*0.05}px`;
  }

  // setting hearts size
  for(let heart of hearts){
    heart.style.height = heartSize;
    heart.style.width = heartSize;
  }
  // setting timer size
  time.style.fontSize = timeSize;

  // setting boxes size based on parent container
  const allBoxes = parentElement.children;
  const boxWidth = (parent.style.width)*0.1;
  for(let box of allBoxes){
    const coin = box.querySelector('#coin').style;
    box.style.display = 'block';
    box.style.width = `${boxWidth}px`;
    box.style.height = `${boxWidth}px`;
    coin.width = `100%`;
    coin.height = `100%`;
  }
}

// update scoreboard per coin click
export function updateScoreBoard(stats, coinColor){
  if(coinColor == 'red'){
    stats.playerLife -= 1;
    failClickAnimation();
  }
}

// update player's life
export function updateLifeDisplay(lifeContainer, stats){
  let tempLife = stats.playerLife;
  const hearts = lifeContainer.children;

  for(let x = 0; x < 3; x++){
    if(tempLife > 0) {
      hearts[x].style.backgroundImage = `url('./pictures/alive.png')`;
    }
    else hearts[x].style.backgroundImage = `url('./pictures/dead.png')`;
    tempLife -= 1;
  }
}

// updates gamespeed
export function updateGameSpeed(stats, minGamespeed){
  if(stats.level === 6) stats.gamespeed = minGamespeed;
  else if(stats.level < 2) stats.gamespeed = 2000;
  else if(stats.level < 3) stats.gamespeed = 1500;
  else if(stats.level < 4) stats.gamespeed = 1100;
  else if(stats.level < 5) stats.gamespeed = 900;
  else stats.gamespeed = 700;
}

export function getShadowColor(object) {
  const namedColors = {
    '24,219,27': 'green',
    '12,73,242': 'blue',
    '242,211,12': 'yellow',
    '242,89,12': 'orange',
    '67,8,168': 'purple',
    '0,151,167': 'teal',
  };

  const coin = window.getComputedStyle(object).getPropertyValue('box-shadow').match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*\d+(?:\.\d+)?)?\s*\)/i)[0]
  const rgbValues = coin.match(/\d+/g).slice(0, 3).join(',');
  return namedColors[rgbValues] || 'red';
}