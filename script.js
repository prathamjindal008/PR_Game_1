const wheels = [
  { el: document.getElementById("w1"), pos: 0, interval: null },
  { el: document.getElementById("w2"), pos: 0, interval: null },
  { el: document.getElementById("w3"), pos: 0, interval: null }
];

const stopBtn = document.getElementById("stopBtn");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");
const machine = document.querySelector(".machine");
const bulbFrame = document.querySelector(".bulb-frame");

const itemHeight = 90;
const speed = 7;
const repeatCount = 60;

let stopIndex = 0;

/* Build reels */
function buildReels() {
  wheels.forEach(w => {
    w.el.innerHTML = "";
    for (let i = 0; i < repeatCount * 10; i++) {
      w.el.innerHTML += `<div class="number">${i % 10}</div>`;
    }
    w.pos = 0;
    w.el.style.transform = `translateY(0)`;
  });
}

/* Start spinning */
function startSpin() {
  stopIndex = 0;
  result.textContent = "";
  machine.classList.remove("jackpot");
  bulbFrame.classList.remove("jackpot");

  wheels.forEach(w => {
    w.interval = setInterval(() => {
      w.pos -= speed;
      if (Math.abs(w.pos) > repeatCount * 10 * itemHeight / 2) {
        w.pos = 0;
      }
      w.el.style.transform = `translateY(${w.pos}px)`;
    }, 20);
  });
}

/* Slow brake */
function slowStop(wheel) {
  let localSpeed = speed;

  const brake = setInterval(() => {
    localSpeed -= 0.6;

    if (localSpeed <= 0) {
      clearInterval(brake);

      const value = Math.abs(Math.round(wheel.pos / itemHeight)) % 10;
      wheel.pos = -value * itemHeight;
      wheel.el.style.transform = `translateY(${wheel.pos}px)`;

      if (value === 8) {
        wheel.el.children[value].classList.add("win");
      }

      stopIndex++;
      if (stopIndex === 3) checkJackpot();
      return;
    }

    wheel.pos -= localSpeed;
    wheel.el.style.transform = `translateY(${wheel.pos}px)`;
  }, 20);
}

/* Stop button */
stopBtn.addEventListener("click", () => {
  if (stopIndex >= 3) return;
  clearInterval(wheels[stopIndex].interval);
  slowStop(wheels[stopIndex]);
});

/* Spin again */
spinBtn.addEventListener("click", () => {
  wheels.forEach(w => clearInterval(w.interval));
  buildReels();
  startSpin();
});

/* Jackpot check */
function checkJackpot() {
  const values = wheels.map(w =>
    Math.abs(Math.round(w.pos / itemHeight)) % 10
  );

  if (values.every(v => v === 8)) {
    result.textContent = "✨ JACKPOT! TRIPLE 8 ✨";
    machine.classList.add("jackpot");
    bulbFrame.classList.add("jackpot");
    particleBurst();
  } else {
    result.textContent = "❌ Try Again";
  }
}

/* Particle burst */
function particleBurst() {
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    document.body.appendChild(p);

    p.style.left = window.innerWidth / 2 + "px";
    p.style.top = window.innerHeight / 2 + "px";

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 200;

    p.animate([
      { transform: "translate(0,0)", opacity: 1 },
      { transform: `translate(${Math.cos(angle)*distance}px, ${Math.sin(angle)*distance}px)`, opacity: 0 }
    ], { duration: 800 });

    setTimeout(() => p.remove(), 800);
  }
}

/* Init */
buildReels();
startSpin();


