// -----------------------------
// NAVIGATION LOGIC
// - Mobile toggle
// - Close on link click
// - Scroll-spy active link highlight
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");
  const sections = document.querySelectorAll("section[id]");

  // ✅ Mobile menu toggle
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navToggle.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");

      navToggle.classList.toggle("active");
      primaryNav.classList.toggle("open");
    });

    // ✅ Close menu when clicking a link (mobile only)
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (primaryNav.classList.contains("open")) {
          primaryNav.classList.remove("open");
          navToggle.classList.remove("active");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", "Open menu");
        }
      });
    });
  }

  // ✅ Scroll-spy active nav indicator
  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 4;

    sections.forEach(section => {
      const id = section.getAttribute("id");

      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(link => {

          // ignore external / booking button
          if (link.classList.contains("no-scroll")) {
            link.classList.remove("active");
            return;
          }

          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);
});
