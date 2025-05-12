const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const images = ["dog.png", "bird.png", "koi.png", "hermit.png"];
let currentIndex = 0;
let scale = 1;
let img = new Image();
let dragging = false;
let lastX = 0, lastY = 0, offsetX = 0, offsetY = 0;
let initialDistance = null;

function loadImage(index) {
  img.src = images[index];
  img.onload = () => drawImage();
}

function drawImage() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);
  ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
}

// PC: ホイールで拡大（画像は切り替えない）
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  scale = Math.min(Math.max(0.5, scale + delta), 3);
  drawImage();
});

// PC: ドラッグ移動
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

// スマホ: タップで画像切り替え
canvas.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  loadImage(currentIndex);
});

// スマホ: ピンチで拡大縮小（画像切り替えなし）
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

loadImage(currentIndex);