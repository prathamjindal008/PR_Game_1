const wheels = [
  { el: document.getElementById("w1"), pos: 0, interval: null },
  { el: document.getElementById("w2"), pos: 0, interval: null },
  { el: document.getElementById("w3"), pos: 0, interval: null }
];

const stopBtn = document.getElementById("stopBtn");
const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");
const machine = document.querySelector(".machine");

let stopIndex = 0;
const speed = 4;          
const itemHeight = 90;
const repeatCount = 160;

function buildReels() {
  wheels.forEach(wheel => {
    let content = "";
    for (let i = 0; i < repeatCount * 10; i++) {
      content += `<div class="number">${i % 10}</div>`;
    }
    wheel.el.innerHTML = content;
    wheel.pos = 0;
    wheel.el.style.transform = `translateY(0)`;
  });
}

function startSpin() {
  stopIndex = 0;
  result.textContent = "";
  machine.classList.remove("jackpot");

  wheels.forEach(wheel => {
    wheel.interval = setInterval(() => {
      wheel.pos -= speed;

      if (Math.abs(wheel.pos) > repeatCount * 10 * itemHeight / 2) {
        wheel.pos = 0;
      }

      wheel.el.style.transform = `translateY(${wheel.pos}px)`;
    }, 20);
  });
}

stopBtn.addEventListener("click", () => {
  if (stopIndex >= wheels.length) return;

  const wheel = wheels[stopIndex];
  clearInterval(wheel.interval);

  const value = Math.abs(Math.round(wheel.pos / itemHeight)) % 10;
  wheel.pos = -value * itemHeight;
  wheel.el.style.transform = `translateY(${wheel.pos}px)`;

  const numberEl = wheel.el.children[value];
  if (value === 8) {
    numberEl.classList.add("win");
  }

  stopIndex++;

  if (stopIndex === 3) {
    const values = wheels.map(w =>
      Math.abs(Math.round(w.pos / itemHeight)) % 10
    );

    if (values.every(v => v === 8)) {
      result.textContent = " JACKPOT! TRIPLE 8 ";
      machine.classList.add("jackpot");
    } else {
      result.textContent = " Try Again";
    }
  }
});

spinBtn.addEventListener("click", () => {
  wheels.forEach(wheel => {
    clearInterval(wheel.interval);
  });

  buildReels();
  startSpin();
});

buildReels();
startSpin();

