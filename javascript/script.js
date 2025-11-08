/* homepage.js
*/

document.addEventListener('DOMContentLoaded', () => {
  // Populate year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------
     Reviews carousel (simple)
     ----------------------- */
  const reviews = [
    { name: "Maya R.", text: "Thomas is amazing with my spaniel Rita – she gets so excited when he arrives for walks! I always get fun photo updates and can tell she’s in great hands.", rating: 5 },
    { name: "Lindiwe K.", text: "I’ve booked Thomas for overnight stays a few times now, and every time my pets are calm, happy, and well cared for. It’s such a relief knowing they’re safe with him.", rating: 5 },
    { name: "Peter S.", text: "Very reliable and easy to communicate with. My cat, who’s usually shy, warmed up to Thomas surprisingly fast – that says it all!", rating: 4 },
    { name: "Sibongile M.", text: "Professional, kind, and trustworthy. Thomas really goes the extra mile to fit my busy schedule. Highly recommend Trusty Paws!", rating: 5 }
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
   GSAP Animations (Timeline + ScrollTrigger)
   ----------------------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && window.gsap && window.gsap.utils) {
  try {
    // === TIMELINE ANIMATION ===
    const heroTl = gsap.timeline();
    heroTl
      .from('.hero-copy', { opacity: 0, y: 18, duration: 0.7 })
      .from('.hero-media img', { opacity: 0, scale: 0.95, duration: 0.9 }, '-=0.3');

    // === SCROLLTRIGGER ANIMATIONS ===
    gsap.utils.toArray('.service-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 80%' },
        opacity: 0,
        y: 18,
        duration: 0.6,
        delay: i * 0.1,
      });
    });

    gsap.utils.toArray('.steps li').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: '#how', start: 'top 85%' },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.08,
      });
    });

    gsap.from('.reviews-list li', {
      scrollTrigger: { trigger: '#reviews', start: 'top 90%' },
      opacity: 0,
      y: 18,
      duration: 0.6,
    });

  } catch (err) {
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








