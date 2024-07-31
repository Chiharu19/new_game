import { updateLifeDisplay, getShadowColor } from "./game_control.js";
import { endGameLoop } from "../code.js";

// makes coins appear at random boxes
export function randomPopUp(coinCount, colors, boxes, stats, lifeContainer){
  for(let x = 0; x < coinCount; x++){
    let notGood = true;
    do {
      const box = boxes[Math.floor(Math.random() * 6)];
      const coin = box.querySelector('#coin');
      const displayProperty = window.getComputedStyle(coin).display;
      
      if(displayProperty != 'flex'){
        coin.style.boxShadow = `inset 0px 0px 25px 5px ${trapOrNot(colors, stats.level)}`;
        coin.style.display = `flex`;

        setTimeout(() => {
          const boxShadowColor = getShadowColor(coin);

          if(!(boxShadowColor === 'red') && coin.style.display === 'flex' && false) stats.playerLife -= 1;
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
  if(Math.floor(Math.random() * 2)) return 'red';
  else {
    return colors[level];
  }
}