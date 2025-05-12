
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const images = ["dog.png", "bird.png", "koi.png", "hermit.png"];
let currentIndex = 0;
let scale = 1;
let img = new Image();
let dragging = false;
let lastX = 0, lastY = 0, offsetX = 0, offsetY = 0;

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

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scale += delta;
    if (scale > 2.5) {
        currentIndex = (currentIndex + 1) % images.length;
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        loadImage(currentIndex);
    }
    drawImage();
});

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

window.addEventListener("resize", drawImage);

loadImage(currentIndex);
