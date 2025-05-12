const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const label = document.getElementById("label");
const sound = document.getElementById("switch-sound");

const images = [
  { file: "dog.png", name: "りん" },
  { file: "bird.png", name: "すず" },
  { file: "koi.png", name: "金華" },
  { file: "hermit.png", name: "ジャム" }
];

let currentIndex = 0;
let scale = 1;
let img = new Image();
let dragging = false;
let lastX = 0, lastY = 0, offsetX = 0, offsetY = 0;
let initialDistance = null;

function loadImage(index) {
  img.src = images[index].file;
  img.onload = () => drawImage();
  label.textContent = images[index].name;
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}

function drawImage() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);
  ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
}

// PC用：ホイールでズーム
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  scale = Math.min(Math.max(0.5, scale + delta), 3);
  drawImage();
});

// PC用：ドラッグ移動
canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseleave", () => dragging = false);
canvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    offsetX += e.clientX - lastX;
    offsetY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    drawImage();
  }
});

// タップまたはクリックで画像切り替え
canvas.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  loadImage(currentIndex);
});

// モバイル：タッチ移動とピンチズーム
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    dragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    initialDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (dragging && e.touches.length === 1) {
    offsetX += e.touches[0].clientX - lastX;
    offsetY += e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    drawImage();
  } else if (e.touches.length === 2 && initialDistance !== null) {
    const currentDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const delta = (currentDistance - initialDistance) * 0.0015;
    scale = Math.min(Math.max(0.5, scale + delta), 3);
    initialDistance = currentDistance;
    drawImage();
  }
}, { passive: false });

canvas.addEventListener("touchend", () => {
  dragging = false;
  initialDistance = null;
});

window.addEventListener("resize", drawImage);

// 初期表示
loadImage(currentIndex);