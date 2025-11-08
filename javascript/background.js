(function () {
  const stickers = [
    "images/background/dog_background.png",
    "images/background/cat_background.png",
    "images/background/bunny_background.png",
    "images/background/bird_background.png",
    "images/background/fish_background.png",
    "images/background/dog_bone_background.png",
    "images/background/dog_bowl_background.png",
  ];

  const DESKTOP_COUNT = 10;
  const MOBILE_COUNT = 6;

  const container = document.getElementById("backgroundStickers");

  function makeSticker(src) {
    const el = document.createElement("div");
    el.className = "sticker";

    const min =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--sticker-min")
      ) || 56;
    const max =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--sticker-max")
      ) || 120;
    const size = Math.floor(Math.random() * (max - min + 1)) + min;

    const padding = 6;
    const left = Math.random() * (100 - padding * 2) + padding;
    const top = Math.random() * (100 - padding * 2) + padding;

    const duration = Math.random() * 10 + 8; // 8–18s
    const delay = Math.random() * 10; // 0–10s
    const reverse = Math.random() > 0.5;

    el.style.left = `${left}%`;
    el.style.top = `${top}%`;
    el.style.width = `${size}px`;
    el.style.animation = `${
      reverse ? "floatYReverse" : "floatY"
    } ${duration}s ease-in-out ${delay}s infinite`;

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");

    el.appendChild(img);
    return el;
  }

  function populate() {
    container.innerHTML = "";
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

    for (let i = 0; i < count; i++) {
      const src = stickers[i % stickers.length];
      container.appendChild(makeSticker(src));
    }
  }

  populate();

  // Recreate on resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(populate, 300);
  });

  // -----------------------------
  // GSAP MotionPath Stickers (SVG animation)
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined" || typeof MotionPathPlugin === "undefined")
      return;
    gsap.registerPlugin(MotionPathPlugin);

    const container = document.getElementById("backgroundStickers");
    if (!container) return;

    const motionStickers = [
      "images/background/dog_bone_background.png",
      "images/background/fish_background.png",
      "images/background/paw_background.png",
    ];

    motionStickers.forEach((src, i) => {
      const el = document.createElement("img");
      el.src = src;
      el.alt = "";
      el.classList.add("motion-sticker");
      container.appendChild(el);

      // Randomize size, scale, and duration
      const size = gsap.utils.random(48, 96);
      el.style.width = `${size}px`;
      el.style.height = "auto";
      el.style.position = "absolute";
      el.style.opacity = "0.2";
      el.style.pointerEvents = "none";

      // Animate along SVG path
      gsap.to(el, {
        duration: gsap.utils.random(12, 20),
        repeat: -1,
        ease: "none",
        motionPath: {
          path: "#floatPath",
          align: "#floatPath",
          alignOrigin: [0.5, 0.5],
          start: 0,
          end: 1,
        },
        scale: gsap.utils.random(0.6, 1.2),
        yoyo: true,
        delay: i * 2,
      });
    });
  });
})();
