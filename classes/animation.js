const parentBg = document.getElementById('background');
const fallers = document.querySelectorAll('.faller');
const failClickShadow = document.querySelector('.failClickShadow');

function animateFallers(){
  const numArray = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
  let count = 0;
  
  const fallerNum = () => {
    let notPassed = true;
    let fallerNumber;
    while(notPassed){
      fallerNumber = Math.floor(Math.random() * 16);
      console.log(fallerNumber)

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
    console.log('faller animated')
  }, 800);
}

function changeThemeColor(level, colors){
  for(let faller of fallers){
    faller.style.border = `3px solid ${colors[level]}`;
  }
}

export function startMainAnimation(stats, colors, time){
  animateFallers();

  const whiteoutElement = document.querySelector('.whiteout');
  setInterval(() => {
    if(time.seconds == 29 || time.seconds == 59){
      whiteoutElement.style.opacity = '1';
      setTimeout(() => {
        whiteoutElement.style.opacity = '0';
      }, 1000);

      changeThemeColor(stats.level+1, colors);
    }

    if(stats.playerLife <= 0){
      const container = document.getElementById('container');
      const time = document.getElementById('time');
      const boxes = document.querySelectorAll('#box');

      container.style.border = `3px solid red`;
      time.style.color = `red`;

      for(let box of boxes){
        box.style.border = `3px solid red`;
      }

      for(let faller of fallers){
        faller.style.border = `3px solid red`;
      }
    }
  }, 800);
}

export function failClickAnimation(){
  failClickShadow.style.opacity = '1';
  setTimeout(() => failClickShadow.style.opacity = '0', 250);
}