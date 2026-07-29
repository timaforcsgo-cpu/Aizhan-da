let currentScreen = 1;
let recipientName = "";

/* ─────────────────────────────
   SCREEN NAVIGATION
───────────────────────────── */
function nextScreen(n) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById("screen" + n);
  if (el) el.classList.add("active");
  currentScreen = n;

  if (n === 4) startResultsAnimation();
}

/* ─────────────────────────────
   SCREEN 1: BOOT SEQUENCE
───────────────────────────── */
(function bootSequence() {
  const lines = ["t1","t2","t3","t4"];
  const bar   = document.getElementById("progressBar");
  const pct   = document.getElementById("progressPct");
  let progress = 0;
  let lineIdx  = 0;

  // Reveal terminal lines one by one
  lines.forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("hidden");
    }, i * 700);
  });

  // Fill progress bar
  const ticker = setInterval(() => {
    progress = Math.min(progress + 2, 100);
    bar.style.width = progress + "%";
    pct.textContent = progress + "%";

    if (progress >= 100) {
      clearInterval(ticker);
      setTimeout(() => nextScreen(2), 800);
    }
  }, 60);
})();

/* ─────────────────────────────
   SCREEN 2: NAME VERIFICATION
───────────────────────────── */
function verifyName() {
  const input = document.getElementById("nameInput");
  const msg   = document.getElementById("verifyMessage");
  const raw   = input.value.trim();

  if (!raw) {
    msg.textContent = "Введите свое имя ";
    input.focus();
    return;
  }

  // Capitalize first letter of each word
  recipientName = raw.replace(/\b\w/g, c => c.toUpperCase());

  msg.textContent = `Identity confirmed ✅ Welcome, ${recipientName}.`;
  msg.style.color = "#33ff88";

  // Populate name spans throughout
  document.querySelectorAll(".name-span").forEach(el => {
    el.textContent = recipientName;
  });

  setTimeout(() => nextScreen(3), 1300);
}

// Allow pressing Enter in name input
document.getElementById("nameInput").addEventListener("keydown", e => {
  if (e.key === "Enter") verifyName();
});

/* ─────────────────────────────
   SCREEN 3: OPTION SELECTION
───────────────────────────── */
function pickOption(btn, next) {
  // Visually select the option first
  document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  setTimeout(() => nextScreen(next), 450);
}

/* ─────────────────────────────
   SCREEN 4: RESULTS ANIMATION
───────────────────────────── */
const resultLines = [
  { text: "> Aнализ улыбки...",           delay: 0 },
  { text: "> Проверка вайба...",               delay: 900 },
  { text: "> Сканирование ред флагов... none found.", delay: 1800 },
  { text: "> Поиск прекрасного... ✓",       delay: 2700 },
  { text: "> Вероятность быть самой красивой на земле: MAXIMUM",          delay: 3600 },
  { text: `> Окончательный вердикт: ${"\u00A0"}`,             delay: 4400, final: true, finalText: "Можно щеголять. ❤️" },
];

function startResultsAnimation() {
  const container = document.getElementById("resultsLines");
  container.innerHTML = "";
  const btn = document.getElementById("continueBtn");
  btn.classList.add("hidden");

  resultLines.forEach(({ text, delay, final, finalText }) => {
    setTimeout(() => {
      const span = document.createElement("span");
      span.className = "result-line" + (final ? " final" : "");
      span.textContent = text + (final ? finalText : "");
      container.appendChild(span);
    }, delay);
  });

  setTimeout(() => {
    btn.classList.remove("hidden");
  }, 5200);
}

/* ─────────────────────────────
   SCREEN 5: MEMORY LANE
───────────────────────────── */
const memories = [
  "Помнишь как мы играли и гуляли",
  "Момент когда ты мне понравилась",
  "Момент когда ты застряла у меня в голове",
  "Я думаю ты заслуживаешь большего❤️",
];
let memoryIndex = 0;

function nextMemory() {
  memoryIndex++;
  if (memoryIndex < memories.length) {
    const el = document.getElementById("memoryText");
    el.style.opacity = "0";
    setTimeout(() => {
      el.textContent = memories[memoryIndex];
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = "1";
    }, 300);
  } else {
    nextScreen(6);
  }
}

/* ─────────────────────────────
   SCREEN 6 → 7: PLOT TWIST
───────────────────────────── */
function plotTwist() {
  nextScreen(7);
  createConfetti(60);
}

/* ─────────────────────────────
   SCREEN 7: OPEN LETTER
───────────────────────────── */
function openLetter() {
  nextScreen(8);

  const firstName = recipientName.split(" ")[0] || recipientName;

  const html = `
    После тщательного изучения всех представленных данных...<br><br>
    <span class="highlight">Ты была офицально выбрана как самая красивая.</span>
    ${firstName}, В Настоящее время вы приглашены:<br><br>
    <span class="highlight">На свиданку гулянку 💖</span>
    В день когда тебе удобно &bull; 15:00<br>
    Dress code: look pretty (which is easy for you)
  `;

  document.getElementById("letterText").innerHTML = html;
}

/* ─────────────────────────────
   SCREEN 8: NO BUTTON RUNS AWAY
───────────────────────────── */
function runAway(e) {
  const btn  = document.getElementById("noBtn");
  const wrap = btn.parentElement;
  const wRect = wrap.getBoundingClientRect();
  const bRect = btn.getBoundingClientRect();

  const maxX = (wRect.width  - bRect.width)  / 2;
  const maxY = 30;

  const rx = (Math.random() * 2 - 1) * maxX;
  const ry = (Math.random() * 2 - 1) * maxY;

  btn.style.transform = `translate(${rx}px, ${ry}px)`;

  // Fade it slightly each time
  const current = parseFloat(btn.style.opacity) || 1;
  btn.style.opacity = Math.max(0.15, current - 0.18);
}

/* ─────────────────────────────
   SCREEN 8 → 9: ACCEPT DATE
───────────────────────────── */
function acceptDate() {
  nextScreen(9);
  createConfetti(120);
}

/* ─────────────────────────────
   CONFETTI
───────────────────────────── */
function createConfetti(count = 80) {
  const colors = [
    "#ff4d88","#ff8ec8","#ffcce0",
    "#ff1f6b","#fff0f5","#ff6b9d",
    "#ffb347","#ffe0f0"
  ];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.classList.add("confetti-piece");
      el.style.left     = Math.random() * 100 + "vw";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = (Math.random() * 3 + 2) + "s";
      el.style.animationDelay   = (Math.random() * 0.5) + "s";
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      el.style.width  = (Math.random() * 8 + 6) + "px";
      el.style.height = (Math.random() * 8 + 6) + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, Math.random() * 400);
  }
}

/* ─────────────────────────────
   PARTICLE BACKGROUND
───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx    = canvas.getContext("2d");
  let W, H, dots;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeDots() {
    dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,230,${d.alpha * 0.6})`;
      ctx.fill();

      d.x += d.dx;
      d.y += d.dy;
      if (d.x < 0 || d.x > W) d.dx *= -1;
      if (d.y < 0 || d.y > H) d.dy *= -1;
    });
    requestAnimationFrame(draw);
  }

  resize();
  makeDots();
  draw();
  window.addEventListener("resize", () => { resize(); makeDots(); });
})();
