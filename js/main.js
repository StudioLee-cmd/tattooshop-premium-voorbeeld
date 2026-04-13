/* ============================================================
   CLIENT PREMIUM TEMPLATE — MAIN.JS
   Handles: Lenis smooth scroll, GSAP ScrollTrigger animations,
   text reveals, color transitions, carousel, mobile menu,
   header logo visibility, filters, and page transitions.
   ============================================================ */

// --- LENIS SMOOTH SCROLL ---
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Single RAF source: let GSAP ticker drive Lenis (no duplicate RAF)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// --- HEADER LOGO VISIBILITY ---
function initHeaderLogo() {
  const headerLogo = document.querySelector('.header-logo');
  const heroTitle = document.querySelector('.hero-title');
  if (!headerLogo || !heroTitle) return;

  ScrollTrigger.create({
    trigger: heroTitle,
    start: 'bottom top+=100',
    onEnter: () => headerLogo.classList.add('visible'),
    onLeaveBack: () => headerLogo.classList.remove('visible'),
  });
}

// --- INTRO BANNER: GSAP entrance + scroll parallax (reversible) ---
function initIntroBanner() {
  const banner = document.querySelector('.intro-banner');
  if (!banner) return;

  const blockHello = banner.querySelector('.intro-block--hello');
  const blockWeare = banner.querySelector('.intro-block--weare');
  const blockBrand = banner.querySelector('.intro-block--brand');
  const tagline = banner.querySelector('.intro-tagline');
  const headerLogo = document.querySelector('.header-logo');

  // --- ENTRANCE: animate blocks in from below on page load ---
  const entranceTl = gsap.timeline();

  if (blockHello) {
    gsap.set(blockHello, { y: 80, opacity: 0, rotation: -3 });
    entranceTl.to(blockHello, {
      y: 0, opacity: 1, rotation: -3,
      duration: 0.7, ease: 'cubic-bezier(0.55, 0.01, 0, 1)',
    }, 0.2);
  }

  if (blockWeare) {
    gsap.set(blockWeare, { y: 80, opacity: 0, rotation: -1 });
    entranceTl.to(blockWeare, {
      y: 0, opacity: 1, rotation: -1,
      duration: 0.7, ease: 'cubic-bezier(0.55, 0.01, 0, 1)',
    }, 0.45);
  }

  if (blockBrand) {
    gsap.set(blockBrand, { y: 80, opacity: 0, rotation: -2 });
    entranceTl.to(blockBrand, {
      y: 0, opacity: 1, rotation: -2,
      duration: 0.7, ease: 'cubic-bezier(0.55, 0.01, 0, 1)',
    }, 0.65);
  }

  if (tagline) {
    gsap.set(tagline, { y: 40, opacity: 0 });
    entranceTl.to(tagline, {
      y: 0, opacity: 1,
      duration: 0.8, ease: 'cubic-bezier(0.55, 0.01, 0, 1)',
    }, 0.9);
  }

  // --- SCROLL: parallax exit uses fromTo() so start/end states are explicit ---
  // Wait for entrance to finish before creating scroll triggers
  entranceTl.eventCallback('onComplete', () => {

    // Hello flies up fastest
    if (blockHello) {
      gsap.fromTo(blockHello,
        { y: 0, opacity: 1, rotation: -3 },
        { y: -300, opacity: 0, rotation: -3, ease: 'none',
          scrollTrigger: {
            trigger: banner, start: '40% top', end: 'bottom top',
            scrub: 0.3,
          },
        }
      );
    }

    // WE ARE slightly slower
    if (blockWeare) {
      gsap.fromTo(blockWeare,
        { y: 0, opacity: 1, rotation: -1 },
        { y: -220, opacity: 0, rotation: -1, ease: 'none',
          scrollTrigger: {
            trigger: banner, start: '45% top', end: 'bottom top',
            scrub: 0.3,
          },
        }
      );
    }

    // Brand shrinks toward top-left corner
    if (blockBrand) {
      gsap.fromTo(blockBrand,
        { scale: 1, opacity: 1, y: 0, rotation: -2 },
        { scale: 0.1, opacity: 0, y: -100, rotation: -2, ease: 'none',
          scrollTrigger: {
            trigger: banner, start: '50% top', end: '90% top',
            scrub: 0.4,
          },
        }
      );
    }

    // Tagline fades out
    if (tagline) {
      gsap.fromTo(tagline,
        { y: 0, opacity: 1 },
        { y: -100, opacity: 0, ease: 'none',
          scrollTrigger: {
            trigger: banner, start: '35% top', end: '70% top',
            scrub: 0.3,
          },
        }
      );
    }

    ScrollTrigger.refresh();
  });

  // --- HEADER LOGO: appears when brand block exits, hides when scrolling back ---
  if (headerLogo) {
    ScrollTrigger.create({
      trigger: banner,
      start: '80% top',
      onEnter: () => headerLogo.classList.add('visible'),
      onLeaveBack: () => headerLogo.classList.remove('visible'),
    });
  }
}

// --- HERO TEXT REVEAL ---
function initHeroReveal() {
  const lines = document.querySelectorAll('.hero-title .line-inner');
  const heroText = document.querySelector('.hero-text');
  const heroVideo = document.querySelector('.hero-video');

  // Reveal hero title lines with stagger
  if (lines.length) {
    gsap.to(lines, {
      scrollTrigger: {
        trigger: '.hero-title',
        start: 'top 80%',
        once: true,
      },
      onStart: () => {
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('revealed'), i * 150);
        });
      },
    });

    // Also reveal immediately if already in viewport on load
    setTimeout(() => {
      lines.forEach((line, i) => {
        setTimeout(() => line.classList.add('revealed'), i * 150);
      });
    }, 200);
  }

  // Reveal hero text
  if (heroText) {
    setTimeout(() => heroText.classList.add('revealed'), 600);
  }

  // Reveal hero video
  if (heroVideo) {
    setTimeout(() => heroVideo.classList.add('revealed'), 800);
  }
}

// --- CHAR-BY-CHAR TEXT REVEAL ---
function initTextReveal() {
  const sections = document.querySelectorAll('.text-reveal-content');

  sections.forEach((section) => {
    // Split text into words and chars
    const text = section.textContent.trim();
    section.innerHTML = '';

    const words = text.split(/\s+/);
    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      word.split('').forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });

      section.appendChild(wordSpan);
    });

    // Animate chars on scroll
    const chars = section.querySelectorAll('.char');
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        chars.forEach((char, i) => {
          const charProgress = i / chars.length;
          if (charProgress <= progress) {
            char.classList.add('revealed');
          } else {
            char.classList.remove('revealed');
          }
        });
      },
    });
  });
}

// --- BACKGROUND COLOR TRANSITIONS ---
function initColorTransitions() {
  const pageBg = document.querySelector('.page-bg');
  if (!pageBg) return;

  const colorSections = document.querySelectorAll('[data-bg-color]');
  colorSections.forEach((section) => {
    const color = section.dataset.bgColor;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        pageBg.style.backgroundColor = color;
      },
      onEnterBack: () => {
        pageBg.style.backgroundColor = color;
      },
    });
  });
}

// --- SECTION FADE-IN ON SCROLL ---
function initSectionReveals() {
  const revealEls = document.querySelectorAll('.section-reveal, .service-item, .team-block');

  revealEls.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        setTimeout(() => el.classList.add('revealed'), i % 4 * 100);
      },
    });
  });
}

// --- WORK GRID REVEAL ---
function initWorkGrid() {
  const grid = document.querySelector('.work-grid');
  if (!grid) return;

  ScrollTrigger.create({
    trigger: grid,
    start: 'top 90%',
    once: true,
    onEnter: () => grid.classList.add('revealed'),
  });

  // Staggered item reveal
  const items = grid.querySelectorAll('.grid-item-enter');
  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        setTimeout(() => item.classList.add('visible'), (i % 3) * 100);
      },
    });
  });
}

// --- SIMPLE CAROUSEL (drag-based) ---
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  if (!track) return;

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let currentX = 0;

  const slides = track.querySelectorAll('.carousel-slide');
  if (!slides.length) return;

  // Calculate bounds
  function getMaxScroll() {
    return track.scrollWidth - carousel.clientWidth;
  }

  function setPosition(x) {
    currentX = Math.max(-getMaxScroll(), Math.min(0, x));
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
  }

  // Mouse events
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    track.classList.add('is-dragging');
    startX = e.pageX;
    scrollLeft = currentX;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - startX;
    setPosition(scrollLeft + x);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    track.classList.remove('is-dragging');
  });

  // Touch events
  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX;
    scrollLeft = currentX;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - startX;
    setPosition(scrollLeft + x);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// --- MOBILE MENU ---
function initMobileMenu() {
  const btn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open');
    menu.classList.toggle('is-open');
    btn.classList.toggle('is-open');

    if (lenis) {
      isOpen ? lenis.start() : lenis.stop();
    }
  });

  // Close on link click
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      if (lenis) lenis.start();
    });
  });

  // Close on backdrop click
  const backdrop = menu.querySelector('.mobile-menu-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      if (lenis) lenis.start();
    });
  }
}

// --- FILTERS (work + blog page) ---
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('[data-category]');
  if (!filterBtns.length) return;

  function applyFilter(filter) {
    // Update button active state
    filterBtns.forEach((b) => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });

    // Filter cards with animation
    caseCards.forEach((card) => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.remove('visible');
        setTimeout(() => (card.style.display = 'none'), 500);
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Cluster cards also trigger filters (blog page)
  const clusterCards = document.querySelectorAll('[data-cluster-filter]');
  clusterCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      applyFilter(card.dataset.clusterFilter);
      // Scroll to the grid
      const grid = document.querySelector('.blog-grid');
      if (grid && lenis) {
        lenis.scrollTo(grid, { offset: -100 });
      }
    });
  });
}

// --- TICKER DUPLICATION (ensure seamless loop) ---
function initTicker() {
  const tickers = document.querySelectorAll('.ticker');
  tickers.forEach((ticker) => {
    // Duplicate content for seamless loop
    const content = ticker.innerHTML;
    ticker.innerHTML = content + content;
  });
}

// --- PAGE HERO ANIMATIONS (about, work, contact pages) ---
function initPageHero() {
  const heroH1 = document.querySelector('.page-hero-title');
  const heroDesc = document.querySelector('.page-hero-desc');

  if (heroH1) {
    heroH1.style.opacity = '0';
    heroH1.style.transform = 'translateY(40px)';
    setTimeout(() => {
      heroH1.style.transition = 'all 1.2s cubic-bezier(0.55, 0.01, 0, 1)';
      heroH1.style.opacity = '1';
      heroH1.style.transform = 'translateY(0)';
    }, 100);
  }

  if (heroDesc) {
    heroDesc.style.opacity = '0';
    heroDesc.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroDesc.style.transition = 'all 1s cubic-bezier(0.55, 0.01, 0, 1)';
      heroDesc.style.opacity = '1';
      heroDesc.style.transform = 'translateY(0)';
    }, 400);
  }
}

// --- CONTACT FORM ANIMATIONS ---
function initContactForm() {
  const groups = document.querySelectorAll('.form-group');
  groups.forEach((group, i) => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';

    ScrollTrigger.create({
      trigger: group,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        setTimeout(() => {
          group.style.transition = 'all 0.6s ease-out';
          group.style.opacity = '1';
          group.style.transform = 'translateY(0)';
        }, i * 100);
      },
    });
  });
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Init Lenis smooth scroll
  initLenis();

  // Init all animations
  initIntroBanner();
  initHeaderLogo();
  initHeroReveal();
  initTextReveal();
  initColorTransitions();
  initSectionReveals();
  initWorkGrid();
  initCarousel();
  initMobileMenu();
  initFilters();
  initTicker();
  initPageHero();
  initContactForm();
});

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
