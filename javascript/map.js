document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.classList.toggle('open');
    });
  }

  // Service card click — reload same page with highlight
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Coverage form — placeholder simulation
  const checkBtn = document.getElementById('check-suburb');
  const suburbInput = document.getElementById('suburb');
  const mapPlaceholder = document.getElementById('map-placeholder');

  if (checkBtn && suburbInput && mapPlaceholder) {
    checkBtn.addEventListener('click', () => {
      const suburb = suburbInput.value.trim();
      if (!suburb) {
        mapPlaceholder.innerHTML = `<p>Please enter a suburb name.</p>`;
        mapPlaceholder.style.background = 'linear-gradient(135deg,#fdd,#faa)';
        return;
      }
      mapPlaceholder.innerHTML = `<p>Service coverage in <strong>${suburb}</strong> is available within 5–10km range.</p>`;
      mapPlaceholder.style.background = 'linear-gradient(135deg,#b2f2bb,#69db7c)';
    });
  }

  // GSAP scroll animations
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.gsap) {
    gsap.from('.service-card', {
      scrollTrigger: { trigger: '.services', start: 'top 85%' },
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.6
    });
    gsap.from('.coverage-map', {
      scrollTrigger: { trigger: '.coverage-map', start: 'top 90%' },
      opacity: 0,
      y: 25,
      duration: 0.8
    });
  }
});
