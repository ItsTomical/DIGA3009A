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
   Pet facts (live APIs)
   ----------------------- */

const dogFactEl = document.getElementById('dog-fact');
const catFactEl = document.getElementById('cat-fact');
const newDogBtn = document.getElementById('new-dog-fact');
const newCatBtn = document.getElementById('new-cat-fact');

// Fetch functions
async function fetchDogFact() {
  try {
    const res = await fetch('https://dogapi.dog/api/v2/facts');
    const data = await res.json();
    dogFactEl.style.opacity = 0;
    setTimeout(() => {
      dogFactEl.textContent = ` ${data.data[0].attributes.body}`;
      dogFactEl.style.opacity = 1;
    }, 150);
  } catch {
    dogFactEl.textContent = "Couldn't fetch a dog fact right now 🐾";
  }
}

async function fetchCatFact() {
  try {
    const res = await fetch('https://catfact.ninja/fact');
    const data = await res.json();
    catFactEl.style.opacity = 0;
    setTimeout(() => {
      catFactEl.textContent = ` ${data.fact}`;
      catFactEl.style.opacity = 1;
    }, 150);
  } catch {
    catFactEl.textContent = "Couldn't fetch a cat fact right now 🐾";
  }
}

// Load on page load
fetchDogFact();
fetchCatFact();

// Buttons
if (newDogBtn) newDogBtn.addEventListener('click', fetchDogFact);
if (newCatBtn) newCatBtn.addEventListener('click', fetchCatFact);




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








