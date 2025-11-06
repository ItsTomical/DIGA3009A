let lastPawTime = 0;
const pawDelay = 120; // ms between prints

window.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastPawTime < pawDelay) return;
  lastPawTime = now;

  const paw = document.createElement("div");
  paw.classList.add("paw-print");

  // Fixed to viewport so GSAP scroll layers can't hide it
  paw.style.position = "fixed";
  paw.style.left = `${e.clientX}px`;
  paw.style.top = `${e.clientY}px`;

  // random paw rotation
  paw.style.transform += ` rotate(${Math.random() * 40 - 20}deg)`;

  document.body.appendChild(paw);

  setTimeout(() => paw.remove(), 1200);
});
