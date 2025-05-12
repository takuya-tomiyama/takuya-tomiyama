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
  sound.currentTime = 0;
  sound.play();
}

function drawImage() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);
  ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
}

// 省略：wheel, mouse, touch イベント（前と同じ）

canvas.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  loadImage(currentIndex);
});

// touch, drag, resize は前回と同じでOK