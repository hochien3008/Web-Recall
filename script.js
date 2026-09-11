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

  // 4. Interactive Phone Mockup Navigation
  const phoneNavItems = document.querySelectorAll('.app-bottom-nav .nav-item');
  phoneNavItems.forEach(navItem => {
    navItem.addEventListener('click', () => {
      phoneNavItems.forEach(item => item.classList.remove('active'));
      navItem.classList.add('active');
    });
  });

  // 5. Interactive Photo Grid Click (light feedback)
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
