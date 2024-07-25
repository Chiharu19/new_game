import { updateLifeDisplay } from "./game_control.js";
import { endGameLoop } from "../code.js";


// makes coins appear at random boxes
export function randomPopUp(coinCount, colors, boxes, stats, lifeContainer){
  for(let x = 0; x < coinCount; x++){
    console.log(`coin pop up TRYING`);
    let notGood = true;
    do {
      const box = boxes[Math.floor(Math.random() * 6)];
      const coin = box.querySelector('#coin');
      const displayProperty = window.getComputedStyle(coin).display;
      console.log(displayProperty);
      
      if(displayProperty != 'block'){
        coin.style.backgroundColor = colors[Math.floor(Math.random() * 6 + 1)];
        coin.style.display = `block`;

        console.log(`declaring success`);
        setTimeout(() => {
          if(!(coin.style.backgroundColor === 'red') && coin.style.display === 'block' && false) stats.playerLife -= 1;
          updateLifeDisplay(lifeContainer, stats);

          coin.style.display = `none`;

          if(stats.playerLife <= 0){ // end gameloop if life === 0
            console.log(`ending game loop`);
            endGameLoop();
          }
        }, stats.gamespeed-50);

        notGood = false;
        
      }
    } while (notGood);
  }
}