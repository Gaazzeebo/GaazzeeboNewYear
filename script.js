// Constants and DOM Elements
const countdownDate = new Date("January 1, 2025 00:00:00").getTime();
let fireworksActive = false;
let confettiActive = false;

const daysCard = document.getElementById("days-card");
const hoursCard = document.getElementById("hours-card");
const minutesCard = document.getElementById("minutes-card");
const secondsCard = document.getElementById("seconds-card");
const celebrateButton = document.getElementById("celebrateButton");
const typewriterTextElem = document.getElementById("typewriterText");

// Event Listeners
celebrateButton.addEventListener("click", (e) => {
  console.log("Celebrate button clicked!");
  triggerCelebration();
});
window.addEventListener("resize", setCanvasSize);

// Canvas Setup
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
setCanvasSize();

// Typewriter Messages with Gaazzeebo Branding
const typewriterMessages = [
  "✨ Gaazzeebo wishes you a spark-filled celebration!",
  "🎉 Join Gaazzeebo in welcoming 2025...",
  "🌟 Together with Gaazzeebo, embrace new possibilities!",
  "🎊 Your success is our celebration!",
  "💫 Gaazzeebo: Lighting the way to your future!"
];

let msgIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

// Countdown Logic
const countdownInterval = setInterval(() => {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  if (distance <= 0) {
    clearInterval(countdownInterval);
    updateAllCards("00");
    if (!fireworksActive || !confettiActive) {
      triggerCelebration();
    }
  } else {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateAllCards(days, hours, minutes, seconds);
  }
}, 1000);

// Helper Functions
function updateAllCards(days, hours, minutes, seconds) {
  flipCountdown(daysCard, formatTime(days));
  flipCountdown(hoursCard, formatTime(hours));
  flipCountdown(minutesCard, formatTime(minutes));
  flipCountdown(secondsCard, formatTime(seconds));
}

function formatTime(time) {
  return time < 10 ? "0" + time : time.toString();
}

function flipCountdown(cardElem, newVal) {
  const frontElem = cardElem.querySelector(".flip-card-front");
  const backElem = cardElem.querySelector(".flip-card-back");

  if (frontElem.textContent === newVal) return;

  backElem.textContent = newVal;
  cardElem.classList.add("flipped");
  
  setTimeout(() => {
    frontElem.textContent = newVal;
    cardElem.classList.remove("flipped");
  }, 600);
}

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Typewriter Effect
function typewriter() {
  const currentMsg = typewriterMessages[msgIndex];
  
  if (!isPaused) {
    if (!isDeleting) {
      typewriterTextElem.textContent = currentMsg.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentMsg.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
        }, 2000);
      }
    } else {
      typewriterTextElem.textContent = currentMsg.substring(0, charIndex);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % typewriterMessages.length;
      }
    }
  }

  const speedFactor = isDeleting ? 0.5 : 1;
  const baseSpeed = isDeleting ? 30 : 100;
  setTimeout(typewriter, baseSpeed * speedFactor);
}

// Start typewriter
typewriter();

// Fireworks Animation
const fireworks = [];
const maxFireworks = 12;
const maxSparks = 70;

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.5;
  const firework = { sparks: [] };

  for (let i = 0; i < maxSparks; i++) {
    const spark = {
      x: x,
      y: y,
      vx: Math.random() * 5 - 2.5,
      vy: Math.random() * 5 - 2.5,
      alpha: 1,
      color: getRandomColor()
    };
    firework.sparks.push(spark);
  }
  fireworks.push(firework);
}

function animateFireworks() {
  requestAnimationFrame(animateFireworks);
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (fireworksActive) {
    if (Math.random() < 0.07 && fireworks.length < maxFireworks) {
      createFirework();
    }

    for (let i = 0; i < fireworks.length; i++) {
      const firework = fireworks[i];
      for (let j = 0; j < firework.sparks.length; j++) {
        const spark = firework.sparks[j];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.02; // Add gravity effect
        spark.alpha -= 0.01;

        ctx.beginPath();
        ctx.arc(spark.x, spark.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${spark.color.r}, ${spark.color.g}, ${spark.color.b}, ${spark.alpha})`;
        ctx.fill();

        if (spark.alpha <= 0) {
          firework.sparks.splice(j, 1);
          j--;
        }
      }
      if (firework.sparks.length === 0) {
        fireworks.splice(i, 1);
        i--;
      }
    }
  }
}

function getRandomColor() {
  const colors = [
    { r: 255, g: 215, b: 0 },   // Gold
    { r: 255, g: 0, b: 0 },     // Red
    { r: 0, g: 255, b: 255 },   // Cyan
    { r: 255, g: 182, b: 193 }, // Pink
    { r: 255, g: 255, b: 255 }  // White
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Confetti Animation
function createConfettiParticle() {
  const confettiContainer = document.getElementById("confetti-container");
  const elem = document.createElement("div");
  elem.classList.add("confetti");
  
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  elem.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
  
  elem.style.left = Math.random() * 100 + "%";
  elem.style.transform = `rotate(${Math.random() * 360}deg)`;
  confettiContainer.appendChild(elem);

  const fallSpeed = 2 + Math.random() * 5;
  const swayAmount = 15 + Math.random() * 15;
  const swaySpeed = 0.1 + Math.random() * 0.1;
  
  let posY = -10;
  let posX = parseFloat(elem.style.left);
  let rotation = 0;
  let time = 0;
  
  const animation = setInterval(() => {
    time += swaySpeed;
    posY += fallSpeed;
    const swayOffset = Math.sin(time) * swayAmount;
    rotation += 2;
    
    elem.style.top = posY + "px";
    elem.style.left = `calc(${posX}% + ${swayOffset}px)`;
    elem.style.transform = `rotate(${rotation}deg)`;

    if (posY > window.innerHeight + 30) {
      clearInterval(animation);
      confettiContainer.removeChild(elem);
    }
  }, 16);
}

function launchConfetti() {
  for (let i = 0; i < 200; i++) {
    setTimeout(() => createConfettiParticle(), Math.random() * 3000);
  }
}

// Celebration Trigger
function triggerCelebration() {
  console.log("Triggering celebration effects...");
  
  if (!fireworksActive) {
    console.log("Starting fireworks...");
    fireworksActive = true;
    animateFireworks();
  }
  
  if (!confettiActive) {
    console.log("Starting confetti...");
    confettiActive = true;
    launchConfetti();
    
    // Launch new confetti every 3 seconds
    setInterval(() => {
      if (confettiActive) {
        for (let i = 0; i < 20; i++) {
          setTimeout(() => createConfettiParticle(), Math.random() * 3000);
        }
      }
    }, 3000);
  }
}