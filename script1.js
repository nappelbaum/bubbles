const imgstr = [
  "ship2.png",
  "bullet.png",
  "bubble1.png",
  "fon.jpg",
  "explore1.png",
  "trans.png",
];
let imgs = [];
let youx = 370,
  youy = 520;
let buls = [];
let bubbles = [];
let explores = [];
let flashing = {};
const youstepx = 4,
  youstepy = 4;
let score = 0;
let lives = 3;
let bestScore = 0;
let time = 300;
let isPaused = false;
const btnStart = document.querySelector(".btnStart");
const btnStartAgain = document.querySelector(".btnStartAgain");
const $bestScore = document.querySelector(".score");
const $timer = document.querySelector(".timer");
const timerTenSec = document.querySelector(".timer10Sec");
const pausedGame = document.querySelectorAll(".game-on-pause, .press-Space");

getLocalStorageData();

function cls_bul_bub(i, j) {
  let x1 = bubbles[j].x,
    y1 = bubbles[j].y;
  let x2 = buls[i].x,
    y2 = buls[i].y;

  if (x2 + 12 > x1 && x2 + 6 <= x1 + 35 && y2 + 39 > y1 && y1 + 70 > y2) {
    bubbles[j].ySpeed = -2;
    bubbles[j].xSpeed = 2;
    buls.splice(i, 1);
    return 1;
  }

  if (x2 + 6 > x1 + 35 && x1 + 70 > x2 && y2 + 39 > y1 && y1 + 70 > y2) {
    bubbles[j].ySpeed = -2;
    bubbles[j].xSpeed = -2;
    buls.splice(i, 1);
    return 1;
  }

  return 0;
}

function cls_bub_bub(i, j) {
  if (
    Math.abs(bubbles[i].x - bubbles[j].x) < 54 &&
    Math.abs(bubbles[i].y - bubbles[j].y) < 54 &&
    bubbles[i].y > 0 &&
    bubbles[i].y < 530
  ) {
    new_explore(i);

    if (bubbles[i].y < bubbles[j].y) {
      bubbles.splice(i, 1);
    } else {
      bubbles.splice(j, 1);
    }
    if (lives > 0 && time >= 0) {
      score += 1;
    }
  }
}

function cls_bub_you(i) {
  if (
    bubbles[i].x + 52 > youx &&
    youx + 52 > bubbles[i].x &&
    bubbles[i].y + 52 > youy &&
    youy + 52 > bubbles[i].y
  ) {
    new_flashing(i);
    bubbles.splice(i, 1);
    lives -= 1;
    return 1;
  }
  return 0;
}

function new_bullet() {
  let tmp = {};
  tmp.x = youx + 34;
  tmp.y = youy - 10;
  buls.push(tmp);
}

function move_bullet() {
  let bul_del = false;
  for (let i = buls.length - 1; i >= 0; i--) {
    bul_del = false;
    buls[i].y -= 7;
    for (let j = bubbles.length - 1; j >= 0; j--) {
      if (bul_del === false && cls_bul_bub(i, j) === 1) bul_del = true;
    }
    if (bul_del === false && buls[i].y < 0) buls.splice(i, 1);
  }
}

function new_bubble() {
  let randomAppear = Math.random() * 1000;
  setTimeout(function () {
    let tmp1 = {};
    tmp1.x = Math.round(Math.random() * 800);
    tmp1.y = -10;
    let randomDir = Math.round(Math.random());
    if (randomDir === 0) {
      tmp1.xSpeed = 2;
    } else {
      tmp1.xSpeed = -2;
    }
    tmp1.ySpeed = 2;
    bubbles.push(tmp1);
  }, randomAppear);
}

function appearanceBubble() {
  setInterval(function () {
    if (!isPaused) new_bubble();
  }, 1000);
}

function move_bubble() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].x += bubbles[i].xSpeed;
    bubbles[i].y += bubbles[i].ySpeed;
    if (bubbles[i].x > 730) bubbles[i].xSpeed = -2;
    if (bubbles[i].x < 0) bubbles[i].xSpeed = 2;
    if (cls_bub_you(i) === 1) return true;

    for (let j = 0; j < bubbles.length; j++) {
      if (i < j) cls_bub_bub(i, j);
    }

    if (bubbles[i].y > 700 || bubbles[i].y < -170) bubbles.splice(i, 1);
  }
}

function new_explore(i) {
  let tmp2 = {};
  tmp2.x = bubbles[i].x;
  tmp2.y = bubbles[i].y;
  explores.push(tmp2);
}

function new_flashing(i) {
  flashing.x = youx;
  flashing.y = youy;
  setTimeout(function () {
    delete flashing.x;
    delete flashing.y;
  }, 300);
  setTimeout(function () {
    flashing.x = youx;
    flashing.y = youy;
  }, 600);
  setTimeout(function () {
    delete flashing.x;
    delete flashing.y;
  }, 900);
  setTimeout(function () {
    flashing.x = youx;
    flashing.y = youy;
  }, 1200);
  setTimeout(function () {
    delete flashing.x;
    delete flashing.y;
  }, 1500);
}

const pressed = {};
document.addEventListener("keydown", function (e) {
  pressed[e.code] = true;
  if (e.code === "KeyX") {
    new_bullet();
  }
});
document.addEventListener("keyup", function (e) {
  pressed[e.code] = false;
});

function move_you() {
  if (pressed["ArrowLeft"]) {
    youx -= youstepx;
    flashing.x -= youstepx;
  }
  if (pressed["ArrowRight"]) {
    youx += youstepx;
    flashing.x += youstepx;
  }
  if (pressed["ArrowDown"]) {
    youy += youstepy;
    flashing.y += youstepy;
  }
  if (pressed["ArrowUp"]) {
    youy -= youstepy;
    flashing.y -= youstepy;
  }
}

function timer() {
  if (youx >= 750) {
    youx = 750;
  }
  if (youx <= -25) {
    youx = -25;
  }
  if (youy >= 530) {
    youy = 530;
  }
  if (youy <= 50) {
    youy = 50;
  }

  if (!isPaused) {
    move_you();
    move_bullet();
    move_bubble();
    draw();
  }

  window.requestAnimationFrame(timer);
}

btnStart.addEventListener("click", function () {
  window.requestAnimationFrame(timer);
  appearanceBubble();
  btnStart.classList.add("hidden");
  startTimer();
  if (isPaused) {
    isPaused = false;
    pausedGame[0].classList.add("hidden");
    pausedGame[1].classList.add("hidden");
  }
});

function ImagesInit() {
  for (let i = 0; i < imgstr.length; i++) {
    let tmp = new Image();
    tmp.src = imgstr[i];
    imgs.push(tmp);
  }
}

function startTimer() {
  const tempTimer = setInterval(function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    $timer.textContent = `${minutes}:${seconds}`;
    if (isPaused === false) time--;

    if (time < 10) {
      timerTenSec.classList.remove("hidden");

      timerTenSec.textContent = `${seconds} seconds left`;
    }

    if (time < 0 || lives <= 0) {
      clearInterval(tempTimer);
      timerTenSec.classList.add("hidden");
    }
  }, 1000);
}

ImagesInit();

function draw() {
  let canvas = document.getElementById("canv");
  ctx = canvas.getContext("2d");

  ctx.drawImage(imgs[3], 0, 0);
  ctx.drawImage(imgs[0], youx, youy, 70, 70);
  ctx.drawImage(imgs[5], flashing.x, flashing.y, 70, 70);

  for (let i = 0; i < bubbles.length; i++) {
    ctx.drawImage(imgs[2], bubbles[i].x, bubbles[i].y, 70, 70);
  }

  for (let i = 0; i < buls.length; i++) {
    ctx.drawImage(imgs[1], buls[i].x, buls[i].y, 5, 25);
  }

  for (let i = 0; i < explores.length; i++) {
    ctx.drawImage(imgs[4], explores[i].x, explores[i].y, 70, 70);
    setTimeout(function () {
      explores.splice(i, 1);
    }, 200);
  }

  ctx.strokeStyle = "#FFFF00";
  ctx.font = "bold 25pt Arial";
  ctx.strokeText("Scores " + score, 20, 50);
  for (let i = 0; i < lives; i++) {
    ctx.drawImage(imgs[0], 510 + i * 58, 20, 50, 50);
  }

  if (lives <= 0 || time < 0) {
    ctx.drawImage(imgs[3], 0, 0);
    ctx.fillStyle = "#FFFF00";
    ctx.font = "bold 40pt Arial";
    ctx.fillText("GAME OVER!", 230, 300);
    ctx.font = "bold 30pt Arial";
    ctx.fillText("Your scores: " + score, 255, 350);
    if (bestScore < score) {
      bestScore = score;
    }
    btnStartAgain.classList.remove("hidden");
    $bestScore.textContent = `Best scores: ${bestScore}`;
    addScoreToLocalStorage();
  }
}

window.addEventListener("load", draw, true);

function startAgain() {
  time = 300;
  startTimer();
  youx = 370;
  youy = 520;
  buls = [];
  bubbles = [];
  explores = [];
  lives = 3;
  score = 0;
  btnStartAgain.classList.add("hidden");
}

btnStartAgain.addEventListener("click", function () {
  setTimeout(function () {
    if (lives <= 0 || time < 0) {
      startAgain();
    }
  }, 1000);
});

document.addEventListener("keydown", function (e) {
  setTimeout(function () {
    if (e.code === "Enter") {
      if (lives <= 0 || time < 0) {
        startAgain();
      }
    }
  }, 1000);
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Space")
    if (lives > 0 && time >= 0) {
      {
        if (isPaused === false) {
          isPaused = true;
          pausedGame[0].classList.remove("hidden");
          pausedGame[1].classList.remove("hidden");
        } else {
          isPaused = false;
          pausedGame[0].classList.add("hidden");
          pausedGame[1].classList.add("hidden");
        }
      }
    }
});

window.addEventListener("blur", function () {
  if (lives > 0 && time >= 0) {
    isPaused = true;
    pausedGame[0].classList.remove("hidden");
    pausedGame[1].classList.remove("hidden");
  }
});

function addScoreToLocalStorage() {
  localStorage.setItem("ScoresStrelialka", JSON.stringify(bestScore));
}

function getLocalStorageData() {
  const data = JSON.parse(localStorage.getItem("ScoresStrelialka"));

  if (!data) return;

  bestScore = data;
  $bestScore.textContent = `Best scores: ${bestScore}`;
}

// localStorage.removeItem("ScoresStrelialka");
