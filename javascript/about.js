// -----------------------------
// About Page Interactive Cards
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".photo-gallery");
  const cards = document.querySelectorAll(".photo-card");

  if (!gallery || cards.length === 0) return;

  // Enable JS styling hook
  gallery.classList.add("js-enabled");

  cards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      cards.forEach((c, i) => {
        if (i < index) {
          c.style.transform = "translateX(-40px) scale(0.9)";
          c.style.opacity = "0.7";
        } else if (i > index) {
          c.style.transform = "translateX(40px) scale(0.9)";
          c.style.opacity = "0.7";
        } else {
          c.style.transform = "scale(1.15)";
          c.style.zIndex = "10";
          c.style.opacity = "1";
        }
      });
    });

    card.addEventListener("mouseleave", () => {
      cards.forEach((c) => {
        c.style.transform = "";
        c.style.opacity = "";
        c.style.zIndex = "";
      });
    });
  });
});

if (window.gsap && window.ScrollTrigger) {
  const aboutTl = gsap.timeline();
  aboutTl.from(".about-text h2", { opacity: 0, y: 20, duration: 0.6 })
          .from(".about-text p", { opacity: 0, y: 10, stagger: 0.2, duration: 0.6 })
          .from(".photo-card", { opacity: 0, scale: 0.9, stagger: 0.15, duration: 0.8 });

  gsap.utils.toArray(".photo-card").forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: "top 90%" },
      y: Math.sin(i) * 8,
      repeat: -1,
      yoyo: true,
      duration: 3 + i * 0.3,
      ease: "sine.inOut",
    });
  });
}

