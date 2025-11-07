// -----------------------------
// NAVIGATION LOGIC (clean, stable)
// - Mobile toggle
// - Close on link click
// - Scroll-spy active link highlight
// - Desktop vertical navbar transform (stable, no flicker)
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");
  const header = document.querySelector(".site-header");
  const body = document.body;

  // Detect homepage (adjust if your routing differs)
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "/TrustyPaws/" ||
    window.location.pathname.includes("home"); // safety for local testing

  // ------------------------
  // Mobile menu toggle
  // ------------------------
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navToggle.setAttribute("aria-label", expanded ? "Open menu" : "Close menu");

      navToggle.classList.toggle("active");
      primaryNav.classList.toggle("open");
    });

    // Close mobile menu when any nav link is clicked
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

  // ------------------------
  // Scroll-spy: highlights active section link
  // ------------------------
  const sections = document.querySelectorAll("section[id]");

  function updateActiveLink() {
    if (!sections || sections.length === 0) return;

    const scrollPos = window.scrollY + window.innerHeight * 0.25;
    let activeSection = null;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        activeSection = section.getAttribute("id");
      }
    });

    // "Home" only when near top
    if (window.scrollY < 80) activeSection = "home";
    if (!activeSection) return;

    navLinks.forEach(link => {
      if (link.classList.contains("no-scroll")) return;
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${activeSection}`);
    });
  }

  // ------------------------
  // Desktop vertical navbar transform (stable)
  // ------------------------
  let isVertical = false;
  let scrollTimer = null;

  function activateVerticalNav() {
    // Set inline styles to ensure it stays fixed in left column
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.left = "0";
    header.style.width = "120px";
    header.style.height = "100vh";

    header.classList.add("nav-vertical");
    body.classList.add("nav-shifted");
    isVertical = true;
  }

  function deactivateVerticalNav() {
    header.classList.remove("nav-vertical");
    body.classList.remove("nav-shifted");
    isVertical = false;

    // Restore header to default (sticky horizontal)
    header.style.position = "sticky";
    header.style.top = "0";
    header.style.left = "";
    header.style.width = "";
    header.style.height = "";
  }

  function ensureMobileHeader() {
    // Make header fixed across mobile/tablet (no vertical)
    header.classList.remove("nav-vertical");
    body.classList.remove("nav-shifted");
    isVertical = false;
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.left = "0";
    header.style.width = "100%";
    header.style.height = "";
  }

  function handleNavTransform() {
    if (!header) return;

    const isMobile = window.innerWidth <= 780;
    const triggerPoint = 40;

    // Mobile/tablet: no vertical nav, make header fixed
    if (isMobile) {
      // Also close mobile menu if open when resizing to mobile width
      if (primaryNav && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        if (navToggle) navToggle.classList.remove("active");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", "Open menu");
        }
      }
      ensureMobileHeader();
      return;
    }

    // Desktop: use debounce for stable toggling
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (window.scrollY > triggerPoint && !isVertical) {
        activateVerticalNav();
      } else if (window.scrollY <= 0 && isVertical) {
        // only revert when at the very top
        deactivateVerticalNav();
      }
      // If neither condition, keep current state (prevents flicker)
    }, 50);
  }

  // ------------------------
  // Event listeners (single set)
  // ------------------------
  if (isHomePage) {
    window.addEventListener("scroll", () => {
      updateActiveLink();
      handleNavTransform();
    });

    window.addEventListener("resize", () => {
      handleNavTransform();

      // If switching from small -> large and hamburger is open, close it
      if (window.innerWidth > 780 && primaryNav && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        if (navToggle) navToggle.classList.remove("active");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", "Open menu");
        }
      }
    });

    // Run once on load to initialize state
    window.addEventListener("load", () => {
      updateActiveLink();
      handleNavTransform();
    });
  } else {
    // Non-home pages: fixed horizontal header (Booking / About)
    header.style.position = "fixed";
    header.style.top = "0";
    header.style.left = "0";
    header.style.width = "100%";
    body.classList.remove("nav-shifted");
    header.classList.remove("nav-vertical");
  }
});
