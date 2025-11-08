// -----------------------------
// UNIVERSAL LIGHTBOX SCRIPT
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // 1. Create the lightbox container dynamically
  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox");
  lightbox.setAttribute("id", "lightbox");
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <img src="" alt="Expanded image" />
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  // 2. Open lightbox on any image with [data-lightbox]
  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.alt || "";
      lightbox.classList.add("active");
    });
  });

  // 3. Close logic (click, Esc, outside)
  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.classList.remove("active");
  });
});
