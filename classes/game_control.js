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

const formatTime = function(unit) {
  return unit < 10 ? '0' + unit : unit;
};

// updates the time in game
export function updateTime(stats, timeBoard, time){
  if(time.seconds === 60) {
    time.minutes += 1;
    time.seconds = 0;
  } else time.seconds += 1;

  timeBoard.innerHTML = `${time.minutes}:${formatTime(time.seconds)}`;

  stats.level = newLevel(time.minutes, time.seconds);

  console.log(`level: ${stats.level}`);
}

// adjusts game elements according to window size
export function adjustElementsSizes(element){
  const allBoxes = element;
  const boxWidth = (window.innerWidth)*0.15;

  for(let box of allBoxes){
    const coin = box.querySelector('#coin').style;
    box.style.display = 'block';
    box.style.width = `${boxWidth}px`;
    box.style.height = `${boxWidth}px`;
    coin.width = `50%`;
    coin.height = `50%`;
  }
}

// update scoreboard per coin click
export function updateScoreBoard(stats, coinColor){
  if(coinColor == 'red') stats.playerLife -= 1;
}

// update player's life
export function updateLifeDisplay(lifeContainer, stats){
  let tempLife = stats.playerLife;
  const hearts = lifeContainer.children;

  for(let x = 0; x < 3; x++){
    if(tempLife > 0) hearts[x].style.backgroundColor = `red`;
    else hearts[x].style.backgroundColor = `black`;
    tempLife -= 1;
  }
}

// updates gamespeed
export function updateGameSpeed(stats, minGamespeed){
  if(stats.level === 6) stats.gamespeed = minGamespeed;
  else if(stats.level < 2) stats.gamespeed = 2000;
  else if(stats.level < 3) stats.gamespeed = 1500;
  else if(stats.level < 4) stats.gamespeed = 1000;
  else if(stats.level < 5) stats.gamespeed = 800;
  else stats.gamespeed = 600;
}