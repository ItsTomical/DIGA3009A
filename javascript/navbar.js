// -----------------------------
// NAVIGATION LOGIC
// - Mobile toggle
// - Close on link click
// - Scroll-spy active link highlight
// - Smooth, stable navbar transform
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");
  const sections = document.querySelectorAll("section[id]");
  const header = document.querySelector(".site-header");
  const body = document.body;

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


  // Final stable scroll-spy — no flicker, resets only at real top
  function updateActiveLink() {
  const scrollPos = window.scrollY + window.innerHeight * 0.25; // smaller top focus area
  let activeSection = null;

  // Loop through all sections to find which is in view
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200; // top offset to trigger a bit later
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      activeSection = section.getAttribute("id");
    }
  });

  // Only trigger "Home" if truly near the very top of the page
  if (window.scrollY < 80) {
    activeSection = "home";
  }

  // Fallback if no section matched (e.g., mid-transition)
  if (!activeSection) return;

  // Update link states
  navLinks.forEach(link => {
    if (link.classList.contains("no-scroll")) return;
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${activeSection}`);
  });
}

// ✅ Smooth, stable vertical navbar transform (desktop only)
let isVertical = false;
let scrollTimer = null;

function handleNavTransform() {
  if (!header) return;

  const triggerPoint = 40; // scroll threshold before switching
  const isMobile = window.innerWidth <= 780; // disable vertical nav on mobile

  // Don't use vertical nav on mobile
  if (isMobile) {
    header.classList.remove("nav-vertical");
    body.classList.remove("nav-shifted");
    isVertical = false;
    return;
  }

  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    if (window.scrollY > triggerPoint && !isVertical) {
      header.classList.add("nav-vertical");
      body.classList.add("nav-shifted");
      isVertical = true;
    } else if (window.scrollY <= triggerPoint && isVertical) {
      header.classList.remove("nav-vertical");
      body.classList.remove("nav-shifted");
      isVertical = false;
    }
  }, 50);
}

// ✅ Event listeners
window.addEventListener("scroll", () => {
  updateActiveLink();
  handleNavTransform();
});

window.addEventListener("resize", handleNavTransform); // keep consistent when resizing
window.addEventListener("load", () => {
  updateActiveLink();
  handleNavTransform();
});

});
