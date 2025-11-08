// -----------------------------
// About Page Interactive Cards
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".photo-gallery");
  const cards = document.querySelectorAll(".photo-card");

  if (!gallery || cards.length === 0) return;

  // Enable JS styling hook
  gallery.classList.add("js-enabled");

  // Hover interactions
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


// -----------------------------
// GSAP Animations — Soft fade + visibility hint
// -----------------------------
window.addEventListener("load", () => {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // About text fade in
    gsap.from(".about-text", {
      scrollTrigger: {
        trigger: ".about-text",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 25,
      duration: 0.6,
      ease: "power2.out",
    });

    // Photo cards visible but softly faded (hints of right-side)
    gsap.set(".photo-card", { opacity: 0.25, scale: 0.95 });

    // Animate left to right on scroll
    gsap.to(".photo-card", {
      scrollTrigger: {
        trigger: ".photo-gallery",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      scale: 1,
      y: 0,
      stagger: {
        each: 0.12,
        from: "start", // left → right
      },
      duration: 0.6,
      ease: "power2.out",
    });

    // Floating idle motion
    gsap.utils.toArray(".photo-card").forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: { trigger: card, start: "top 95%" },
        y: Math.sin(i) * 6,
        repeat: -1,
        yoyo: true,
        duration: 2.8 + i * 0.25,
        ease: "sine.inOut",
      });
    });

    ScrollTrigger.refresh();
  }
});
