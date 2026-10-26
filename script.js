(() => {
  'use strict';
  const reviewGrid = document.getElementById('review-grid');
  const reviewImages = Array.from({ length: 15 }, (_, i) => `assets/reviews/google-review-${String(i + 1).padStart(2, '0')}.jpg`);
  reviewImages.forEach((src, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `review-card reveal${index % 3 === 1 ? ' reveal-delay-1' : index % 3 === 2 ? ' reveal-delay-2' : ''}`;
    button.dataset.lightbox = src;
    button.dataset.caption = `Google review screenshot ${index + 1}`;
    button.setAttribute('aria-label', `Open Google review screenshot ${index + 1}`);
    button.innerHTML = `<span class="review-card-image"><img src="${src}" alt="Google review screenshot ${index + 1}" loading="lazy"></span><span class="review-card-footer"><span>Google review screenshot</span><span aria-hidden="true">↗</span></span>`;
    reviewGrid.appendChild(button);
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.getElementById('site-nav');
  function closeMenu() {
    siteNav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
  menuToggle.addEventListener('click', () => {
    const open = !siteNav.classList.contains('is-open');
    siteNav.classList.toggle('is-open', open);
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeButton = document.getElementById('lightbox-close');
  const prevButton = document.getElementById('lightbox-prev');
  const nextButton = document.getElementById('lightbox-next');
  let activeItems = [];
  let activeIndex = -1;
  let previousFocus = null;

  function collectItems() {
    return Array.from(document.querySelectorAll('[data-lightbox]'));
  }
  function showItem(index) {
    if (!activeItems.length) return;
    activeIndex = (index + activeItems.length) % activeItems.length;
    const item = activeItems[activeIndex];
    const src = item.dataset.lightbox;
    const image = item.querySelector('img');
    lightboxImage.src = src;
    lightboxImage.alt = image ? image.alt : (item.dataset.caption || 'Gym photo');
    lightboxCaption.textContent = item.dataset.caption || (image ? image.alt : 'Photo');
    prevButton.hidden = activeItems.length < 2;
    nextButton.hidden = activeItems.length < 2;
  }
  function openLightbox(item) {
    activeItems = collectItems();
    activeIndex = activeItems.indexOf(item);
    previousFocus = document.activeElement;
    showItem(activeIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }
  document.addEventListener('click', event => {
    const item = event.target.closest('[data-lightbox]');
    if (item && !lightbox.contains(item)) openLightbox(item);
  });
  closeButton.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', () => showItem(activeIndex - 1));
  nextButton.addEventListener('click', () => showItem(activeIndex + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showItem(activeIndex - 1);
    if (event.key === 'ArrowRight') showItem(activeIndex + 1);
  });

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
