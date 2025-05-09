// Only start hiss on first click
let hissStarted = false;

window.addEventListener(
  "click",
  () => {
    if (!hissStarted) {
      const hiss = document.getElementById("hiss-audio");
      if (hiss) {
        hiss.volume = 0.3;
        hiss
          .play()
          .then(() => {
            hissStarted = true;
          })
          .catch((err) => {
            console.warn("Playback blocked:", err);
          });
      }
    }
  },
  { once: true }
);

function startSoundtrack() {
  const hiss = document.getElementById("hiss-audio");
  const body = document.body;

  // remove the fade-in class so it doesn't block fade-out
  body.classList.remove("fade-in");
  body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "track1.html";
  }, 800);

  if (hiss && !hiss.paused) {
    let volume = hiss.volume;
    const fade = setInterval(() => {
      volume -= 0.02;
      if (volume <= 0) {
        hiss.pause();
        hiss.currentTime = 0;
        clearInterval(fade);
      } else {
        hiss.volume = volume;
      }
    }, 30);
  }

  document.body.style.opacity = 0;
  setTimeout(() => {
    window.location.href = "track1.html";
  }, 800);
}

// Grain Canvas Setup
const canvas = document.getElementById("grain-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawGrain() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const buffer = new Uint32Array(imageData.data.buffer);
  const len = buffer.length;

  for (let i = 0; i < len; i++) {
    if (Math.random() < 0.05) {
      buffer[i] = 0xffffffff;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function trackingGlitch() {
  const y = Math.floor(Math.random() * canvas.height);
  const height = Math.floor(Math.random() * 10 + 2);
  const imageData = ctx.getImageData(0, y, canvas.width, height);
  const shift = Math.floor(Math.random() * 10 - 5);
  ctx.putImageData(imageData, shift, y);
}

function applyFlicker() {
  canvas.style.opacity = 0.05 + Math.random() * 0.03;
}

function render() {
  drawGrain();
  if (Math.random() < 0.15) trackingGlitch();
  applyFlicker();
}

setInterval(render, 50);

// === Scanline Canvas Setup ===
const scanCanvas = document.getElementById("scanline-canvas");
const scanCtx = scanCanvas.getContext("2d");

scanCanvas.width = window.innerWidth;
scanCanvas.height = window.innerHeight;

let offset = 0;

function drawScanlines() {
  scanCtx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
  const spacing = 4;
  const height = 1;
  const color = "rgba(255,255,255,0.15)";

  for (let y = offset; y < scanCanvas.height; y += spacing) {
    scanCtx.fillStyle = color;
    scanCtx.fillRect(0, y, scanCanvas.width, height);
  }

  offset = (offset + 0.5) % spacing;
}

setInterval(drawScanlines, 50);
