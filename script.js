// ==========================================================================
// RECALL — INTERACTIVE WEB CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
      
      // Animate hamburger to X
      const bars = mobileToggle.querySelectorAll('.bar');
      if (bars.length === 3) {
        if (!isExpanded) {
          bars[0].style.transform = 'translateY(7px) rotate(45deg)';
          bars[1].style.opacity = '0';
          bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
        }
      }
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const bars = mobileToggle.querySelectorAll('.bar');
        if (bars.length === 3) {
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
        }
      });
    });
  }

  // 2. Modals System (Download, Privacy, Support)
  const downloadModal = document.getElementById('downloadModal');
  const privacyModal = document.getElementById('privacyModal');
  const supportModal = document.getElementById('supportModal');

  function openDialog(modal) {
    closeAllModals();
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
  }

  function closeDialog(modal) {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    const anyOpen = document.querySelector('.download-modal-backdrop.open');
    if (!anyOpen) {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (window.location.hash && (window.location.hash === '#privacy' || window.location.hash === '#support' || window.location.hash.startsWith('#download'))) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }

  function closeAllModals() {
    [downloadModal, privacyModal, supportModal].forEach(m => {
      if (m) {
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
      }
    });
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    if (window.location.hash && (window.location.hash === '#privacy' || window.location.hash === '#support' || window.location.hash.startsWith('#download'))) {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  }

  // Close buttons
  const modalClose = document.getElementById('modalClose');
  const privacyModalClose = document.getElementById('privacyModalClose');
  const supportModalClose = document.getElementById('supportModalClose');
  const privacyGotItBtn = document.getElementById('privacyGotItBtn');

  if (modalClose) modalClose.addEventListener('click', () => closeDialog(downloadModal));
  if (privacyModalClose) privacyModalClose.addEventListener('click', () => closeDialog(privacyModal));
  if (privacyGotItBtn) privacyGotItBtn.addEventListener('click', () => closeDialog(privacyModal));
  if (supportModalClose) supportModalClose.addEventListener('click', () => closeDialog(supportModal));

  // Backdrop click to close
  [downloadModal, privacyModal, supportModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeDialog(modal);
      });
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // iOS Panel Toggle in Download Modal
  const modalIosTrigger = document.getElementById('modalIosTrigger');
  const iosExpandablePanel = document.getElementById('iosExpandablePanel');
  if (modalIosTrigger && iosExpandablePanel) {
    modalIosTrigger.addEventListener('click', () => {
      const isHidden = iosExpandablePanel.style.display === 'none';
      iosExpandablePanel.style.display = isHidden ? 'block' : 'none';
      const chevron = modalIosTrigger.querySelector('.ios-chevron');
      if (chevron) {
        chevron.textContent = isHidden ? '˅' : '›';
      }
    });
  }

  // Link Triggers
  const downloadTriggers = document.querySelectorAll('a[href^="#download"]');
  downloadTriggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDialog(downloadModal);
  }));

  const privacyTriggers = document.querySelectorAll('a[href="#privacy"]');
  privacyTriggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDialog(privacyModal);
  }));

  const supportTriggers = document.querySelectorAll('a[href="#support"]');
  supportTriggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDialog(supportModal);
  }));

  // Handle URL hash on initial load or change
  function checkHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#privacy') {
      openDialog(privacyModal);
    } else if (hash === '#support') {
      openDialog(supportModal);
    } else if (hash.startsWith('#download')) {
      openDialog(downloadModal);
    }
  }
  checkHash();
  window.addEventListener('hashchange', checkHash);

  // 3. Subtle Parallax / Mouse Tilt for Showcase Stage
  const stage = document.getElementById('showcaseStage');
  const polaroids = document.querySelectorAll('.polaroid');

  if (stage && window.innerWidth > 860) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      polaroids.forEach((item) => {
        const factor = parseFloat(item.getAttribute('data-tilt-factor') || '0.03');
        const moveX = x * factor;
        const moveY = y * factor;
        item.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    stage.addEventListener('mouseleave', () => {
      polaroids.forEach((item) => {
        item.style.transform = '';
      });
    });
  }

  // 4. Interactive Phone Mockup Navigation & Tab Switching
  const phoneNavItems = document.querySelectorAll('.app-bottom-nav .nav-item');
  const phoneScreens = {
    home: document.getElementById('phoneTabHome'),
    memories: document.getElementById('phoneTabMemories'),
    albums: document.getElementById('phoneTabAlbums'),
    profile: document.getElementById('phoneTabProfile')
  };

  phoneNavItems.forEach(navItem => {
    navItem.addEventListener('click', () => {
      const tabKey = navItem.getAttribute('data-phone-tab');
      if (!tabKey || !phoneScreens[tabKey]) return;

      phoneNavItems.forEach(item => item.classList.remove('active'));
      navItem.classList.add('active');

      Object.values(phoneScreens).forEach(screen => {
        if (screen) {
          screen.style.display = 'none';
          screen.classList.remove('active');
        }
      });

      phoneScreens[tabKey].style.display = 'block';
      phoneScreens[tabKey].classList.add('active');
    });
  });

  // 5. Bento Search Interactive Demo Chips
  const demoChips = document.querySelectorAll('.demo-chip');
  const demoQueryText = document.getElementById('demoQueryText');
  const demoResultImg = document.getElementById('demoResultImg');
  const demoResultTitle = document.getElementById('demoResultTitle');
  const demoResultMeta = document.getElementById('demoResultMeta');
  const demoResultsPreview = document.getElementById('demoResultsPreview');

  demoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      demoChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const query = chip.getAttribute('data-query');
      const title = chip.getAttribute('data-title');
      const score = chip.getAttribute('data-score');
      const img = chip.getAttribute('data-img');

      if (demoQueryText) {
        demoQueryText.textContent = `"${query}"`;
      }

      if (demoResultsPreview) {
        demoResultsPreview.style.opacity = '0.35';
        demoResultsPreview.style.transform = 'scale(0.98)';
        setTimeout(() => {
          if (demoResultImg) demoResultImg.src = img;
          if (demoResultTitle) demoResultTitle.textContent = `Match: "${title}"`;
          if (demoResultMeta) demoResultMeta.textContent = `OCR match + Vision Embedding ${score}`;
          demoResultsPreview.style.opacity = '1';
          demoResultsPreview.style.transform = 'scale(1)';
        }, 140);
      }
    });
  });

  // 6. Accessible FAQ Accordion Toggle
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      if (!item) return;

      const isCurrentActive = item.classList.contains('active');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherHeader = otherItem.querySelector('.accordion-header');
        const otherIcon = otherItem.querySelector('.accordion-icon');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
      });

      // Toggle clicked item
      if (!isCurrentActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        const icon = item.querySelector('.accordion-icon');
        if (icon) icon.textContent = '−';
      }
    });
  });

  // 7. Scroll Reveal Animations using IntersectionObserver
  const revealElements = document.querySelectorAll(
    '.bento-card, .testimonial-card, .stat-card, .how-it-works-header, .steps-flow, .faq-accordion-container, .cta-banner-card'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 8. Interactive Photo Grid Click (light feedback)
  const gridPhotos = document.querySelectorAll('.memory-grid .grid-item');
  gridPhotos.forEach(photo => {
    photo.addEventListener('click', () => {
      photo.style.transform = 'scale(0.95)';
      setTimeout(() => {
        photo.style.transform = '';
      }, 150);
    });
  });
});

