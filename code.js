import * as coin from './classes/coin.js';
import * as gameControl from './classes/game_control.js';
import * as animations from './classes/animation.js';


// container and boxes
const mainContainer = document.getElementById(`container`);
const boxes = mainContainer.children;
const lifeContainer = document.getElementById(`lifeContainer`);
const timeBoard = document.getElementById('time');

// color selection
const colors = {
  1:`green`,
  2:`blue`,
  3:`yellow`,
  4:`orange`,
  5:`red`,
  6:`purple`
}

// to support keyboard inputs
const keys = ['q', 'w', 'e', 'a', 's', 'd'];
const BoxtoKeyMaps = {}
for(let k = 0; k < 6; k++){
  BoxtoKeyMaps[keys[k]] = boxes[k];
}

// time
const time = {
  minutes : 0,
  seconds : 0
}

// important stats
const stats = {
  playerLife : 3,
  level : 1,
  gamespeed : 2000
}
const minGamespeed = 500;

// variables for storing interval IDs
let intervalID1;
let intervalID2;

// storing coin events
let coinClickHandlers = [];

// checks if the DOM content is loaded before executing gameloop
let contentLoaded = false;

// starts the game loop
document.addEventListener('keydown', startGameLoop);

// keyboard input event
function keyboardInputs(event){
  if(keys.includes(event.key.toLowerCase())){
    const coinInBox = BoxtoKeyMaps[event.key.toLowerCase()].querySelector('#coin');

    if(coinInBox.style.display === 'none') stats.playerLife -= 1;
    else {
      coinInBox.style.display = 'none';
      gameControl.updateScoreBoard(stats, coinInBox.style.backgroundColor); // update score board
    }

    gameControl.updateLifeDisplay(lifeContainer, stats); // update life display

    if(stats.playerLife <= 0){ // end gameloop if life === 0
      console.log(`ending game loop`);
      endGameLoop();
    }
  } else console.log('invalid key');
}

function startGameLoop(event){
  gameloop(event);
}

// main gameloop
function gameloop(event){
  if(event.key === " " && contentLoaded){
    console.log('game started');

    // remove gameloop starter
    document.removeEventListener('keydown', gameloop);

    document.addEventListener('keydown', keyboardInputs);

    // checks for window resizes
    gameControl.adjustElementsSizes(boxes);
    window.addEventListener(`resize`, () => {
      gameControl.adjustElementsSizes(boxes);
    });

    gameControl.updateLifeDisplay(lifeContainer, stats); // initial life display

    // adds click event to the boxes
    for(let box of boxes){
      const clickHandler = () => {
        const coin = box.querySelector('#coin');

        if(coin.style.display === 'block'){
          coin.style.display = 'none';
          gameControl.updateScoreBoard(stats, coin.style.backgroundColor); // update score board
        } else stats.playerLife -= 1;
        
        gameControl.updateLifeDisplay(lifeContainer, stats); // update life display

        if(stats.playerLife <= 0){
          console.log(`ending game loop`);
          endGameLoop(); 
        }
      };

      box.addEventListener('click', clickHandler);
      coinClickHandlers.push({box, clickHandler});
    }

    // handles timer
    intervalID1 = setInterval(() => {
      gameControl.updateTime(stats, timeBoard, time);
      gameControl.updateGameSpeed(stats, minGamespeed);
    },1000);
    

    // handles coins popping up
    intervalID2 = setInterval(() => {
      let coinCount;

      if(stats.level === 1) coinCount = 1;
      else if(stats.level === 2 || stats.level === 4) coinCount = 2;
      else if(stats.level === 3 || stats.level === 5) coinCount = 3;
      else coinCount = Math.floor(Math.random() * 3 + 1);

      coin.randomPopUp(coinCount, colors, boxes, stats, lifeContainer);
    }, stats.gamespeed);
  
  }
}

// ending game loop
export function endGameLoop(){
  clearInterval(intervalID1);
  clearInterval(intervalID2);

  for(let {box, clickHandler} of coinClickHandlers){
    try{removeEventListener('click', clickHandler);}
    catch(error){console.log(error + `: cannot remove coin event`)};
  }

  document.removeEventListener('keydown', keyboardInputs);

  time.minutes = 0;
  time.seconds = 0;

  stats.gamespeed = 2000;
  stats.playerLife = 0;
  stats.level = 1;

  intervalID1 = null;
  intervalID2 = null;

  coinClickHandlers = [];

  contentLoaded = false;
}

document.addEventListener(`DOMContentLoaded`, () => {
  contentLoaded = true
  console.log(`dom, loaded`);
  console.log('waiting space bar');
});