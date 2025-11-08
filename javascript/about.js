// -----------------------------
// About Page Interactive Cards
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".photo-gallery");
  const cards = document.querySelectorAll(".photo-card");

  if (!gallery || cards.length === 0) return;

  gallery.classList.add("js-enabled");

  // Hover effects
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

  // -----------------------------
  // GSAP Animations
  // -----------------------------
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Make sure they're visible from the start (hint of next cards)
    gsap.set(".photo-card", { opacity: 0.3, scale: 0.95 });

    // Animate cards left-to-right on scroll
    gsap.to(".photo-card", {
      scrollTrigger: {
        trigger: ".photo-gallery",
        start: "top 90%",
        toggleActions: "play none none reverse",
        once: true, // only animate once per scroll
      },
      opacity: 1,
      scale: 1,
      y: 0,
      stagger: {
        each: 0.1,
        from: "start",
      },
      duration: 0.5,
      ease: "power2.out",
    });

    // Idle floating motion
    gsap.utils.toArray(".photo-card").forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: { trigger: card, start: "top 95%" },
        y: Math.sin(i) * 6,
        repeat: -1,
        yoyo: true,
        duration: 3 + i * 0.2,
        ease: "sine.inOut",
      });
    });

    // refresh after images load to fix ScrollTrigger positions
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });
  }
});
