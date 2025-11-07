// -----------------------------
// NAVBAR LOADER SCRIPT
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("site-header");
  if (!headerContainer) return;

  fetch("components/header.html")
    .then(res => {
      if (!res.ok) throw new Error("Header fetch failed");
      return res.text();
    })
    .then(html => {
      headerContainer.innerHTML = html;

      // 🐾 Hide Book Now on booking page
      if (window.location.pathname.includes("booking")) {
        const bookNowBtn = headerContainer.querySelector("#bookNowBtn");
        if (bookNowBtn) bookNowBtn.remove();
      }

      // ✅ Now that header HTML exists, initialize the navbar logic
      if (typeof initNavbar === "function") {
        initNavbar();
      } else {
        console.error("initNavbar() not found — check navbar.js load order");
      }
    })
    .catch(err => console.error("Error loading header:", err));
});
