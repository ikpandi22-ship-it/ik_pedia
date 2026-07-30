/* ==========================================================================
   IK_PEDIA Landing Page Interaction Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Mobile Menu Drawer Navigation ---
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when clicking nav links to improve UX
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. Sticky Navbar Scroll Activation Effect ---
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  
  const handleNavbarScroll = () => {
    if (navbarWrapper) {
      if (window.scrollY > 40) {
        navbarWrapper.classList.add('scrolled');
      } else {
        navbarWrapper.classList.remove('scrolled');
      }
    }
  };
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Run immediately on load in case of direct page refresh

  // --- 3. Scroll Reveal Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated to avoid repeated triggers on scrolling back up
        observer.unobserve(entry.target); 
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // --- 4. Custom Mouse Position Glow Tracker (Service Cards) ---
  // Calculates cursor coordinates inside each card and sets properties for css radial gradients
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- 5. Dynamic Scroll Timeline connector (Process Section) ---
  const processSection = document.getElementById('process');
  const timelineFill = document.getElementById('timeline-fill');
  const processSteps = document.querySelectorAll('.process-step');

  const updateTimelineProgress = () => {
    if (!processSection || !timelineFill || processSteps.length === 0) return;
    
    // Check if the reduced motion query is active to skip scroll Calculations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      processSteps.forEach(step => step.classList.add('active'));
      timelineFill.style.width = '100%';
      return;
    }

    const rect = processSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Animate fill line when it enters the viewport middle range
    const startOffset = viewportHeight * 0.8;
    const endOffset = viewportHeight * 0.35;
    
    const elementVisibleHeight = rect.height;
    const elementTopToTrigger = startOffset - rect.top;
    
    let progress = 0;
    if (rect.top <= startOffset && rect.bottom >= endOffset) {
      progress = (elementTopToTrigger / elementVisibleHeight) * 100;
      progress = Math.max(0, Math.min(100, progress));
    } else if (rect.bottom < endOffset) {
      progress = 100;
    }

    timelineFill.style.width = `${progress}%`;

    // Activate individual process nodes based on fill line progress thresholds
    processSteps.forEach((step, index) => {
      const threshold = (index / (processSteps.length - 1)) * 100;
      // Allow slight threshold buffers for smoother activation feel
      if (progress >= (threshold - 8)) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateTimelineProgress);
  window.addEventListener('resize', updateTimelineProgress);
  updateTimelineProgress(); // Invoke once on page load to initialize step states
});
