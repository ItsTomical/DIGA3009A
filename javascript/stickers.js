// Pet sticker image list (just add/remove filenames)
const stickerImages = [
  "paw.png",
  "fish.png",
  "yarn.png",
  "carrot.png",
  "feather.png",
  "heart.png",
];

// How many to generate
const COUNT = 18;

// Create sticker layer
const layer = document.createElement("div");
layer.id = "pet-stickers-layer";
document.body.appendChild(layer);

// Helper to get viewport size
const vw = () => window.innerWidth;
const vh = () => window.innerHeight;

// Create floating stickers
const stickers = [];

for (let i = 0; i < COUNT; i++) {
  const el = document.createElement("div");
  el.className = "pet-sticker";

  const img = stickerImages[i % stickerImages.length];
  el.style.backgroundImage = `url('images/stickers/${img}')`;

  const size = Math.floor(Math.random() * 24) + 32; // 32–56px
  el.style.setProperty("--size", `${size}px`);

  const floatSpeed = (Math.random() * 8 + 10).toFixed(1) + "s"; // 10–18s
  el.style.setProperty("--float-speed", floatSpeed);

  const x = Math.random() * vw();
  const y = Math.random() * vh();

  el.style.transform = `translate(${x}px, ${y}px)`;
  el.dataset.x = x;
  el.dataset.y = y;

  layer.appendChild(el);
  stickers.push(el);
}

// Parallax scroll effect
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  stickers.forEach((el, i) => {
    const speed = (i % 3 + 1) * 0.15; // three parallax depths
    const x = parseFloat(el.dataset.x);
    const y = parseFloat(el.dataset.y);
    el.style.transform = `translate(${x}px, ${y + scrollY * speed}px)`;
  });
});
