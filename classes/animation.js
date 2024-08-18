import { updateLifeDisplay } from "./game_control.js";
import { stats, colors, time } from "../code.js";

const fallers = document.querySelectorAll('.faller');
const failClickShadow = document.querySelector('.failClickShadow');
const whiteoutElement = document.querySelector('.whiteout');
const lifeContainer = document.getElementById(`lifeContainer`);

const maxCount = 10;
let count = 0;

function animateFallers(){
  const numArray = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
  
  const fallerNum = () => {
    let notPassed = true;
    let fallerNumber;
    while(notPassed){
      fallerNumber = Math.floor(Math.random() * 16);

      if(numArray[fallerNumber] != 0) notPassed = false;
    }
    return fallerNumber;
  }
  
  const intervalId = setInterval(() => {
    const num = fallerNum();
    if(numArray[num] != 0){
      fallers[num].style.left = `${numArray[num]}%`;
      fallers[num].style.animation = `meteor-fall 2s linear infinite`;
      fallers[num].style.animationDelay = `${Math.random() * (5 - 2) + 1}s`;
      numArray[num] = 0;
      count += 1;

      if(count >= 16) clearInterval(intervalId);
    }
  }, 800);
}

function changeThemeColor(level, colors){
  for(let faller of fallers){
    faller.style.border = `3px solid ${colors[level]}`;
  }
}

// loading page effects
const loadingPage = document.querySelector('.loadingPage');
const progressBar = document.querySelector('.progressBar');
const pageEffectInterval = setInterval(() => {
  const percent = (count / maxCount) * 100;
  progressBar.style.width = `${percent}%`;
  if(percent === 100){
    loadingPage.style.opacity = '0';
    setTimeout(() => {
      loadingPage.style.display = 'none';
      clearInterval(pageEffectInterval);
    },1000);
  }
},200);

// START BUTTON WHEN CLICKED
const startBtn = document.querySelector('.startBtn');
const introPage = document.querySelector('.intro');
let startBtnHeight;

startBtn.addEventListener('click', () => {
  startBtnHeight = `${window.getComputedStyle(startBtn).height}`;
  startBtn.style.height = '0px';
  startBtn.children[0].style.fontSize = '0px';
  introPage.style.pointerEvents = 'none';
  introPage.style.transition = 'all 0.2s';
  startBtn.style.pointerEvents = 'none';

  // resetting the style of start Btn
  setTimeout(() => {
    startBtn.style.height = startBtnHeight;
    startBtn.children[0].style.fontSize = '200%';
    introPage.style.transition = 'none';
  }, 1000);

  // resetting the style of hearts & fallers
  for(let faller of fallers){
    faller.style.border = `3px solid rgb(24, 219, 27)`;
  }

  updateLifeDisplay(lifeContainer, stats);

  // animation when transitioning between levels
  const transitionInterval = setInterval(() => {
    if(time.seconds == 29 || time.seconds == 59){
      console.log('WHITEOUT');
      whiteoutElement.style.opacity = '1';
      setTimeout(() => {
        whiteoutElement.style.opacity = '0';
      }, 1000);

      changeThemeColor(stats.level+1, colors);
    }

    if((time.minutes > 1 && time.seconds > 30) || stats.playerLife <= 0) clearInterval(transitionInterval);
  }, 500);

  // WHITE OUT WHEN START BUTTON IS CLICKED
  setTimeout(() => {
    whiteoutElement.style.backgroundColor = 'white';
    whiteoutElement.style.opacity = '1';
      setTimeout(() => {
        whiteoutElement.style.opacity = '0';
        introPage.style.opacity = '0';
        setTimeout(() => {
          whiteoutElement.style.backgroundColor = '#0B0B0C', 1000
        }, 1000);
      }, 1200);
  }, 150);
  
});
// MAIN ANIMATION THINGGGGSSSSS
export function startMainAnimation(){
  animateFallers();
}

const formatTime = function(unit, inMinutes) {
  if(inMinutes) return unit;
  else return unit < 10 ? '0' + unit : unit;
};

const endingPage = document.querySelector('.endingPage');
const score = document.querySelector('.score');
const highScore = document.querySelector('.highScore');
const homeBtn = document.querySelector('.homeBtn');
let homeBtnHeight;

// STARTS WHEN THE PLAYER LOSEEEEEE
export function endGameAnimation(highscoreMinutes, highscoreSeconds, minutes, seconds){
  let highTempTime;
  let tempTime;
  const timeStyle = document.querySelector('#time');

  // highscore formatting
  if(highscoreMinutes < 1){
    highTempTime = `${highscoreSeconds}s`;
  } else{
    highTempTime = `${highscoreMinutes}m  ${formatTime(highscoreSeconds, false)}s`;
  }

  // score formatting
  if(minutes < 1){
    tempTime = `${seconds}s`;
  } else{
    tempTime = `${minutes}m  ${formatTime(seconds, false)}s`;
  }

  highScore.innerHTML = `- YOUR LONGEST -<br><br>${highTempTime}`;
  score.innerHTML = `- WHAT YOU GOT -<br><br>${tempTime}`;
  timeStyle.innerHTML = '0:00';

  endingPage.style.pointerEvents = 'all';

  setTimeout(() => {
    endingPage.style.opacity = '1';
    homeBtn.style.pointerEvents = 'all';

    // prepare intro page & start btn
    setTimeout(() => {
      introPage.style.pointerEvents = 'all';
      startBtn.style.pointerEvents = 'all';
    }, 500);
  }, 500)
}

// RUNS WHEN HOME BTN IS PRESSED
homeBtn.addEventListener('click', () => {
  homeBtnHeight = `${window.getComputedStyle(homeBtn).height}`;
  homeBtn.style.height = '0px';
  homeBtn.children[0].style.fontSize = '0px';

  // resetting the style of home Btn after being clicked
  setTimeout(() => {
    homeBtn.style.height = homeBtnHeight;
    homeBtn.children[0].style.fontSize = '200%';
  }, 2000);

  // TRANSITION FROM END PAGE TO INTRO PAGE
  introPage.style.opacity = '1';
  endingPage.style.opacity = '0';

  // remove ending page pointer events after some time
  setTimeout(() => {
    endingPage.style.pointerEvents = 'none';
  }, 500);
});

export function failClickAnimation(){
  failClickShadow.style.opacity = '1';
  setTimeout(() => failClickShadow.style.opacity = '0', 250);
}