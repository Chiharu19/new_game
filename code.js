import {randomPopUp, timeoutId} from './classes/coin.js';
import * as gameControl from './classes/game_control.js';
import { startMainAnimation, failClickAnimation, endGameAnimation} from './classes/animation.js';

// container and boxes
const mainContainer = document.getElementById(`container`);
const boxes = mainContainer.children;
const lifeContainer = document.getElementById(`lifeContainer`);
const timeBoard = document.getElementById('time');

// color selection
export const colors = {
  1:`rgb(24, 219, 27)`, // green
  2:`rgb(12, 73, 242)`, // blue
  3:`rgb(242, 211, 12)`, // yellow
  4:`rgb(242, 89, 12)`, // orange
  5:`rgb(67, 8, 168)`, // purple
  6:`rgb(0, 151, 167)` // teal
}

// to support keyboard inputs
const keys = ['q', 'w', 'e', 'a', 's', 'd'];
const BoxtoKeyMaps = {}
for(let k = 0; k < 6; k++){
  BoxtoKeyMaps[keys[k]] = boxes[k];
}

// time
export const time = {
  minutes : 0,
  seconds : 0,
  highestMinutes : 0,
  highestSeconds : 0
}

// important stats
export const stats = {
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

const startBtn = document.querySelector('.startBtn');
// starts the game loop
startBtn.addEventListener('click', startGameLoop);

// keyboard input event
function keyboardInputs(event){
  if(keys.includes(event.key.toLowerCase())){
    const coinInBox = BoxtoKeyMaps[event.key.toLowerCase()].querySelector('#coin');
    const coinDisplayProperty = window.getComputedStyle(coinInBox).getPropertyValue('display');

    if(coinDisplayProperty === 'none'){
      stats.playerLife -= 1;
      failClickAnimation();
    }
    else {
      coinInBox.style.display = 'none';
      gameControl.updateScoreBoard(stats, gameControl.getShadowColor(coinInBox)); // update score board
    }

    gameControl.updateLifeDisplay(lifeContainer, stats); // update life display

    if(stats.playerLife <= 0){ // end gameloop if life === 0
      endGameLoop();
    }
  } else console.log('invalid key');
}

// checks for window resizes
gameControl.adjustElementsSizes(mainContainer);
window.addEventListener(`resize`, () => {
  gameControl.adjustElementsSizes(mainContainer);
});

function startGameLoop(){
  startBtn.removeEventListener('click', startGameLoop);
  setTimeout(() => gameloop(), 1000);
}

// animation call
startMainAnimation(colors, time);

// main gameloop
function gameloop(){
  if(contentLoaded){
    console.log('game started');

    // makes the game playable
    setTimeout(() => {
      document.addEventListener('keydown', keyboardInputs);
      for(let box of boxes){
        box.style.pointerEvents = 'all';
      }
    }, 1200);

    // initial life display
    gameControl.updateLifeDisplay(lifeContainer, stats); 

    // adds click event to the boxes
    for(let box of boxes){
      const clickHandler = () => {
        const coin = box.querySelector('#coin');
        const coinStyle = window.getComputedStyle(coin).display;

        if(coinStyle === 'flex'){
          coin.style.display = 'none';
          gameControl.updateScoreBoard(stats, gameControl.getShadowColor(coin)); // update score board
        } else{
          stats.playerLife -= 1;
          failClickAnimation();
        }
        
        gameControl.updateLifeDisplay(lifeContainer, stats); // update life display

        if(stats.playerLife <= 0){
          endGameLoop(); 
        }
      };

      box.addEventListener('click', clickHandler);
      coinClickHandlers.push({box, clickHandler});
    }

    // handles timer & continuous pop of coins
    intervalID1 = setInterval(() => {
      gameControl.updateTime(stats, timeBoard, time);
      gameControl.updateGameSpeed(stats, minGamespeed);

      console.log(`level: ${stats.level}\ngamespeed: ${stats.gamespeed}\nlife: ${stats.playerLife}`);

      if(((time.seconds == 29 || time.seconds == 59) && time.minutes < 2) || (time.minutes == 2 && time.seconds == 29)){
        console.log('PAUSING COIN POP UP')
        clearInterval(intervalID2);
        setTimeout(() => {
          intervalID2 = setInterval(() => {
            let coinCount;
      
            if(stats.level === 1) coinCount = 1;
            else if(stats.level === 2 || stats.level === 4) coinCount = 2;
            else if(stats.level === 3 || stats.level === 5) coinCount = 3;
            else coinCount = Math.floor(Math.random() * 3 + 1);
      
            randomPopUp(coinCount, colors, boxes, stats, lifeContainer);
          }, stats.gamespeed);
        }, 1500);
      }
    }, 1000);
    
    // initial pop up of coins
    setTimeout(() => {
      // handles coins popping up
      intervalID2 = setInterval(() => {
        let coinCount;

        if(stats.level === 1) coinCount = 1;
        else if(stats.level === 2 || stats.level === 4) coinCount = 2;
        else if(stats.level === 3 || stats.level === 5) coinCount = 3;
        else coinCount = Math.floor(Math.random() * 3 + 1);

        randomPopUp(coinCount, colors, boxes, stats, lifeContainer);
      }, stats.gamespeed);
    }, 300);
  }
}

// ending game loop
export function endGameLoop(){
  console.log('ending game');

  // clearing the timeout on the coin
  clearTimeout(timeoutId);

  // storing highscores
  time.highestMinutes = Math.max(time.highestMinutes, time.minutes);
  time.highestSeconds = Math.max(time.highestSeconds, time.seconds);

  clearInterval(intervalID1); // timer interval
  clearInterval(intervalID2); // coin pop up interval

  // removing event listeners to the boxes
  for(let {box, clickHandler} of coinClickHandlers){ 
    try{box.removeEventListener('click', clickHandler);}
    catch(error){console.log(error + `: cannot remove coin event`)};
  }

  coinClickHandlers = [];

  // delayed reset to initials
  setTimeout(() => {
    // reseting stats back to initial
    stats.gamespeed = 2000;
    stats.playerLife = 3;
    stats.level = 1;  

    time.minutes = 0;
    time.seconds = 0;

    for(let box1 of boxes){
      const box = box1.querySelector('#coin');
      box.style.display = 'none';
    }
  }, 400)
  
  document.removeEventListener('keydown', keyboardInputs); // keyboard input listeners

  // removing of intervals and timeouts
  intervalID1 = null;
  intervalID2 = null;

  // animating outro
  endGameAnimation(time.highestMinutes, time.highestSeconds, time.minutes, time.seconds);
  // add start btn game starter again
  startBtn.addEventListener('click', startGameLoop);
}

document.addEventListener(`DOMContentLoaded`, () => {
  contentLoaded = true
  console.log(`dom, loaded`);
}); 