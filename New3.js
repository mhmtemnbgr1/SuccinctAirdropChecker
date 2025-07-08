
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const eggs = [];
const stars = [];
const eggColors = ["#ff69b4", "#00f", "#0f0", "#ffa500", "#ff0", "#f0f"];
const starColor = "#ff69b4";

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerRadius;
    let y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawEgg(egg) {
  ctx.beginPath();
  ctx.ellipse(egg.x, egg.y, egg.radius, egg.radius * 1.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = egg.color;
  ctx.fill();
}

function initCanvas() {
  while (eggs.length < 20) {
    eggs.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 40 + Math.random() * 20,
      speed: 0.4 + Math.random() * 0.8,
      color: eggColors[Math.floor(Math.random() * eggColors.length)],
    });
  }

  while (stars.length < 20) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 25 + Math.random() * 10,
      speed: 0.3 + Math.random() * 0.7,
      color: starColor,
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  eggs.forEach(egg => {
    drawEgg(egg);
    egg.y += egg.speed;
    if (egg.y > canvas.height + egg.radius) {
      egg.y = -egg.radius;
      egg.x = Math.random() * canvas.width;
    }
  });

  stars.forEach(star => {
    drawStar(star.x, star.y, 5, star.size, star.size / 2, star.color);
    star.y += star.speed;
    if (star.y > canvas.height + star.size) {
      star.y = -star.size;
      star.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animate);
}

initCanvas();
animate();


const form = document.getElementById("airdropForm");
const calcBtn = document.getElementById("calcBtn");
const claimBtn = document.getElementById("claimBtn");
const resetBtn = document.getElementById("resetBtn");
const airdropAmount = document.getElementById("airdropAmount");
const gprovePopup = document.getElementById("gprovePopup");
let hasCalculated = false;


document.querySelectorAll(".radio-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    const value = btn.dataset.value;
    const group = btn.parentElement;
    group.querySelectorAll(".radio-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const conditional = document.getElementById(target);
    if (value === "yes") {
      conditional.classList.remove("hidden");
    } else {
      conditional.classList.add("hidden");
      conditional.querySelectorAll("input, select").forEach(input => {
        input.dataset.skip = "true";
        input.value = "";
      });
    }

    checkFormFilled();
  });
});


function checkFormFilled() {
  const inputs = form.querySelectorAll("input[type='number']:not([data-skip='true']), select:not([data-skip='true'])");
  let filled = true;
  inputs.forEach(input => {
    if (!input.value) filled = false;
  });

  calcBtn.disabled = !filled;
  claimBtn.disabled = !(filled && hasCalculated);
}


calcBtn.addEventListener("click", () => {
  const formData = new FormData(form);

  const s1Stars = parseInt(formData.get("stage1_stars")) || 0;
  const s1Proof = parseInt(formData.get("stage1_proof")) || 0;
  const s2Stars = parseInt(formData.get("stage2_stars")) || 0;
  const s2Proof = parseInt(formData.get("stage2_proof")) || 0;
  const s25Tokens = parseInt(formData.get("stage25_tokens")) || 0;
  const tweetCount = parseInt(formData.get("avg_tweets")) || 0;
  const discordRole = formData.get("discord_level") || "";

  let total =
    calculateStage1ProofTokens(s1Proof) +
    calculateStage1StarsTokens(s1Stars) +
    calculateStage2ProofTokens(s2Proof) +
    calculateStage2StarsTokens(s2Stars) +
    calculateStage25Tokens(s25Tokens) +
    calculateTweetTokens(tweetCount) +
    calculateDiscordTokens(discordRole);

  airdropAmount.textContent = total + " PROVE";
  hasCalculated = true;
  checkFormFilled();
});


claimBtn.addEventListener("click", () => {
  if (!hasCalculated) return;
  gprovePopup.style.animation = "pop 2s ease";
  setTimeout(() => {
    gprovePopup.style.animation = "none";
  }, 2000);
});


resetBtn.addEventListener("click", () => {
  form.reset();
  form.querySelectorAll(".radio-btn").forEach(btn => btn.classList.remove("active"));
  form.querySelectorAll(".conditional").forEach(div => div.classList.add("hidden"));
  form.querySelectorAll("input, select").forEach(input => input.removeAttribute("data-skip"));
  airdropAmount.textContent = "-- PROVE";
  hasCalculated = false;
  checkFormFilled();
});

form.addEventListener("input", checkFormFilled);


function calculateStage1ProofTokens(proof) {
  if (proof >= 201) return 1800;
  if (proof >= 151) return 1400;
  if (proof >= 101) return 1000;
  if (proof >= 51) return 600;
  if (proof >= 1) return 300;
  return 0;
}

function calculateStage1StarsTokens(stars) {
  if (stars >= 14000) return 1400;
  if (stars >= 10000) return 1000;
  if (stars >= 7000) return 700;
  if (stars >= 3000) return 400;
  return 0;
}

function calculateStage2ProofTokens(proof) {
  if (proof >= 80) return 1600;
  if (proof >= 50) return 1200;
  if (proof >= 20) return 800;
  if (proof >= 10) return 400;
  if (proof >= 1) return 200;
  return 0;
}

function calculateStage2StarsTokens(stars) {
  if (stars >= 1200) return 1200;
  if (stars >= 900) return 1000;
  if (stars >= 600) return 800;
  if (stars >= 300) return 400;
  if (stars >= 1) return 200;
  return 0;
}

function calculateStage25Tokens(tokenCount) {
  if (tokenCount >= 100) return 1500;
  if (tokenCount >= 50) return 1000;
  if (tokenCount >= 20) return 500;
  if (tokenCount >= 1) return 200;
  return 0;
}

function calculateDiscordTokens(role) {
  if (role === "L3") return 3000;
  if (role === "L2") return 2000;
  if (role === "L1") return 1000;
  return 0;
}

function calculateTweetTokens(tweetCount) {
  if (tweetCount >= 100) return 3000;
  if (tweetCount >= 50) return 2000;
  if (tweetCount >= 25) return 1000;
  if (tweetCount >= 10) return 500;
  return 0;
}
