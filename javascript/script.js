/* script.js
   - Pure behaviour file (no inline styles)
   - Nav toggle
   - Reviews carousel
   - Booking form validation + success/error via classes
   - Pet facts local placeholder (easily replaceable with API)
   - GSAP animations (uses classes / selectors only)
*/

document.addEventListener('DOMContentLoaded', () => {
  // Populate year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // NAV TOGGLE (adds/removes class only)
  // const navToggle = document.querySelector('.nav-toggle');
  // const primaryNav = document.getElementById('primary-nav');

  // if (navToggle && primaryNav) {
  //   navToggle.addEventListener('click', () => {
  //     const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  //     navToggle.setAttribute('aria-expanded', String(!expanded));
  //     navToggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
  //     primaryNav.classList.toggle('open');
  //   });

  //   // Close mobile nav when a link is clicked
  //   primaryNav.querySelectorAll('a').forEach(a => {
  //     a.addEventListener('click', () => {
  //       if (primaryNav.classList.contains('open')) {
  //         primaryNav.classList.remove('open');
  //         navToggle.setAttribute('aria-expanded', 'false');
  //         navToggle.setAttribute('aria-label', 'Open menu');
  //       }
  //     });
  //   });
  // }

  /* -----------------------
     Reviews carousel (simple)
     ----------------------- */
  const reviews = [
    { name: "Maya R.", text: "Fantastic service! My spaniel looks forward to walks and I get great photo updates.", rating: 5 },
    { name: "Lindiwe K.", text: "Very reliable. Booked overnight stays twice and felt confident leaving my pets at home.", rating: 5 },
    { name: "Peter S.", text: "Great communicator and very punctual. My cat even warmed up to her quickly!", rating: 4 },
    { name: "Sibongile M.", text: "Flexible and trustworthy — highly recommend for busy professionals.", rating: 5 }
  ];

  const reviewsList = document.getElementById('reviews-list');
  let currentReviewIndex = 0;

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function (m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m];
    });
  }

  function renderReviews(startIndex = 0) {
    if (!reviewsList) return;
    reviewsList.innerHTML = '';
    const visibleCount = window.innerWidth >= 720 ? 2 : 1;
    for (let i = 0; i < visibleCount; i++) {
      const r = reviews[(startIndex + i) % reviews.length];
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="review-card">
          <strong>${escapeHtml(r.name)}</strong>
          <p aria-hidden="true">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</p>
          <p>${escapeHtml(r.text)}</p>
        </div>
      `;
      reviewsList.appendChild(li);
    }
  }

  renderReviews(currentReviewIndex);

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let autoTimer = null;

  function startAutoAdvance(){
    stopAutoAdvance();
    autoTimer = setInterval(() => {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
      renderReviews(currentReviewIndex);
    }, 6000);
  }
  function stopAutoAdvance(){
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  startAutoAdvance();

  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
    renderReviews(currentReviewIndex);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
    renderReviews(currentReviewIndex);
  });

  [prevBtn, nextBtn, reviewsList].forEach(el => {
    if (!el) return;
    el.addEventListener('mouseenter', stopAutoAdvance);
    el.addEventListener('focusin', stopAutoAdvance);
    el.addEventListener('mouseleave', startAutoAdvance);
  });

  // Re-render on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderReviews(currentReviewIndex), 150);
  });

  /* -----------------------
     Pet facts (placeholder)
     ----------------------- */
  const facts = [
    "Dogs' noses are wet to help absorb scent chemicals.",
    "A dog's sense of smell is up to 100,000 times more sensitive than ours.",
    "Cats can make over 100 different vocal sounds.",
    "Puppies are born blind and deaf for the first couple of weeks.",
    "Dogs have unique nose prints just like human fingerprints."
  ];

  const petFactEl = document.getElementById('pet-fact');
  const newFactBtn = document.getElementById('new-fact');

  function showRandomFact(){
    if (!petFactEl) return;
    const idx = Math.floor(Math.random() * facts.length);
    petFactEl.textContent = facts[idx];
  }
  if (newFactBtn) newFactBtn.addEventListener('click', showRandomFact);


  /* -----------------------
     GSAP animations (optional)
     ----------------------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.gsap && window.gsap.utils) {
    try {
      gsap.from('.hero-copy', { opacity: 0, y: 18, duration: 0.7 });
      gsap.from('.hero-media img', { opacity: 0, scale: 0.98, duration: 0.9, delay: 0.2 });
      gsap.utils.toArray('.service-card').forEach((el, i) => {
        gsap.from(el, { scrollTrigger: { trigger: '#services', start: 'top 80%' }, opacity: 0, y: 18, duration: 0.6, delay: i * 0.08 });
      });
      gsap.utils.toArray('.steps li').forEach((el, i) => {
        gsap.from(el, { scrollTrigger: { trigger: '#how', start: 'top 85%' }, opacity: 0, y: 20, duration: 0.6, delay: i * 0.08 });
      });
      gsap.from('.reviews-list li', { scrollTrigger: { trigger: '#reviews', start: 'top 88%' }, opacity: 0, y: 18, duration: 0.6 });
    } catch (err) {
      // fail gracefully if GSAP config not available
      // eslint-disable-next-line no-console
      console.warn('GSAP animation skipped:', err);
    }
  }

  // FAQ accordion toggle
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const open = answer.style.display === 'block';
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    answer.style.display = open ? 'none' : 'block';
  });
});


});








