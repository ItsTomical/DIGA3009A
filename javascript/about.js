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
