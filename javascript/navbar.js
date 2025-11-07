// -----------------------------
// NAVIGATION LOGIC
// - Mobile toggle
// - Close on link click
// - Scroll-spy (homepage only)
// - Vertical nav transform (homepage only)
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");
  const header = document.querySelector(".site-header");
  const body = document.body;

  // Detect if we're on the homepage (index.html)
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "/TrustyPaws/" ||
    window.location.pathname.includes("home"); // safety for local testing

  // Mobile menu toggle
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navToggle.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");

      navToggle.classList.toggle("active");
      primaryNav.classList.toggle("open");
    });

    // Close menu when clicking a link (mobile only)
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

  // ----------------------------------------------------------
  // HOMEPAGE ONLY: Scroll Spy + Vertical Navbar Transform
  // ----------------------------------------------------------
  if (isHomePage) {
    const sections = document.querySelectorAll("section[id]");
    let isVertical = false;
    let scrollTimer = null;

    // Scroll spy for active link highlighting
    function updateActiveLink() {
      const scrollPos = window.scrollY + window.innerHeight * 0.25;
      let activeSection = null;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          activeSection = section.getAttribute("id");
        }
      });

      if (window.scrollY < 80) activeSection = "home";
      if (!activeSection) return;

      navLinks.forEach(link => {
        if (link.classList.contains("no-scroll")) return;
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${activeSection}`);
      });
    }

    // Handle the transform between horizontal ↔ vertical navbar
    function handleNavTransform() {
      if (!header) return;
      const triggerPoint = 40;
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

    window.addEventListener("scroll", () => {
      updateActiveLink();
      handleNavTransform();
    });

    window.addEventListener("load", () => {
      updateActiveLink();
      handleNavTransform();
    });
  } else {
    // ----------------------------------------------------------
    // BOOKING / ABOUT PAGES: Fixed horizontal navbar
    // ----------------------------------------------------------
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.left = "0";
    header.style.width = "100%";
    body.classList.remove("nav-shifted");
    header.classList.remove("nav-vertical");
  }
});
