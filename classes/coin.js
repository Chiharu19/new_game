import { updateLifeDisplay, getShadowColor } from "./game_control.js";
import { endGameLoop } from "../code.js";
import { failClickAnimation } from "./animation.js";

let timeoutId;

// makes coins appear at random boxes
export function randomPopUp(coinCount, colors, boxes, stats, lifeContainer){
  for(let x = 0; x < coinCount; x++){
    let notGood = true;
    do {
      const box = boxes[Math.floor(Math.random() * 6)];
      const coin = box.querySelector('#coin');
      const displayProperty = window.getComputedStyle(coin).display;
      
      if(displayProperty != 'flex'){
        coin.style.boxShadow = `inset 0px 0px 15px 5px ${trapOrNot(colors, stats.level)}`;
        coin.style.display = `flex`;

        // ACTIVATES WHEN COIN LEFT NOT CLICKED
        timeoutId = setTimeout(() => {
          const boxShadowColor = getShadowColor(coin);

          if(!(boxShadowColor === 'red') && coin.style.display === 'flex' && true) {
            stats.playerLife -= 1;
            if(stats.playerLife > -1) failClickAnimation();
          }
          updateLifeDisplay(lifeContainer, stats);

          coin.style.display = `none`;
          
          if(stats.playerLife <= 0){ // end gameloop if life === 0
            endGameLoop();
          }
        }, stats.gamespeed-50);

        notGood = false;
        
      }
    } while (notGood);
  }
}

function trapOrNot(colors, level){
  if(Math.floor(Math.random() * 4)) return colors[level];
  else {
    return 'red';
  }
}

export {timeoutId};