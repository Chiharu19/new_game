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
export function adjustElementsSizes(parentElement){
  const hearts = document.querySelectorAll(`#hearts`);
  const time = document.querySelector('#time');
  const p = document.querySelectorAll('p');
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
  const boxWidth = (parent.style.width)*0.155;
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
  if(coinColor == 'red') stats.playerLife -= 1;
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
  else if(stats.level < 4) stats.gamespeed = 1000;
  else if(stats.level < 5) stats.gamespeed = 800;
  else stats.gamespeed = 600;
}

export function getShadowColor(object) {
  const namedColors = {
    '0,128,0': 'green',
    '0,0,255': 'blue',
    '255,255,0': 'yellow',
    '255,165,0': 'orange',
    '255,192,203': 'pink',
    '128,0,128': 'purple',
  };

  const coin = window.getComputedStyle(object).getPropertyValue('box-shadow').match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*\d+(?:\.\d+)?)?\s*\)/i)[0]
  const rgbValues = coin.match(/\d+/g).slice(0, 3).join(',');
  return namedColors[rgbValues] || 'red';
}