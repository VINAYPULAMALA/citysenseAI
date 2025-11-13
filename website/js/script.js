// ======================= LUCIDE ICONS INITIALIZATION =======================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ======================= NAVBAR SCROLL EFFECT =======================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (navbar) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ======================= SMOOTH SCROLLING =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href.length <= 1) {
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.offsetTop - navbarHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    }
  });
});

// ======================= MOBILE MENU TOGGLE =======================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
let navMenuOpen = false;

const setMenuState = (isOpen) => {
  if (!navLinks || !mobileMenuToggle) return;
  navMenuOpen = isOpen;
  navLinks.classList.toggle('is-open', isOpen);
  mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
};

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    setMenuState(!navMenuOpen);
    if (navMenuOpen) {
      const firstNavLink = navLinks.querySelector('a');
      if (firstNavLink) {
        firstNavLink.focus();
      }
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 899) {
        setMenuState(false);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 899 && navMenuOpen) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenuOpen) {
      setMenuState(false);
      mobileMenuToggle.focus();
    }
  });
}

// ======================= SCROLL TO TOP BUTTON =======================
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scrollToTop';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
scrollBtn.innerHTML = '<i data-lucide="arrow-up"></i>';
document.body.appendChild(scrollBtn);

// Show/hide scroll button based on scroll position
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});

// Scroll to top when button is clicked
scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Initialize icon in scroll button
if (typeof lucide !== 'undefined') {
  setTimeout(() => {
    lucide.createIcons();
  }, 100);
}

// ======================= INTERSECTION OBSERVER FOR ANIMATIONS =======================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const processCards = document.querySelectorAll('.process-card');
  const roadmapCards = document.querySelectorAll('.roadmap-card');

  cards.forEach(card => {
    observer.observe(card);
  });

  processCards.forEach(card => {
    observer.observe(card);
  });

  roadmapCards.forEach(card => {
    observer.observe(card);
  });
});

// ======================= CARD INTERACTION ENHANCEMENTS =======================
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    // Add tilt effect on mouse move
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

// ======================= STATS COUNTER ANIMATION =======================
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    // Format number with K or % suffix
    const text = element.textContent;
    if (text.includes('K')) {
      element.textContent = Math.floor(current) + 'K+';
    } else if (text.includes('%')) {
      element.textContent = Math.floor(current) + '%';
    } else {
      element.textContent = Math.floor(current);
    }
  }, 30);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector('h3');
      const text = statNumber.textContent;
      const number = parseInt(text.replace(/\D/g, ''));
      animateCounter(statNumber, number);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => statsObserver.observe(item));
});

// ======================= PARALLAX EFFECT FOR HERO =======================
if (!prefersReducedMotion.matches) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent && scrolled < hero.offsetHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = Math.max(0.2, 1 - (scrolled / hero.offsetHeight * 0.5));
    }
  });
}

// ======================= BUTTON CLICK ANALYTICS =======================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn, .btn-link').forEach(button => {
    button.addEventListener('click', function(e) {
      const buttonText = this.textContent.trim();
      console.log(`Button clicked: ${buttonText}`);

      // Add ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(38, 215, 255, 0.5)';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.pointerEvents = 'none';

      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left - 10) + 'px';
      ripple.style.top = (e.clientY - rect.top - 10) + 'px';

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);

      // Analytics placeholder
      // Example: gtag('event', 'button_click', { 'button_name': buttonText });
    });
  });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(20);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ======================= LOADING ANIMATION =======================
window.addEventListener('load', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ======================= ACTIVE SECTION HIGHLIGHTING =======================
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');

function highlightNavigation() {
  let scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinksArray.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.style.color = '#26d7ff';
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// ======================= CONSOLE BRANDING =======================
console.log('%c🧠 CitySense AI', 'color: #26d7ff; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cUrban Intelligence Platform - Powered by AI', 'color: #a855f7; font-size: 18px;');
console.log('%cInterested in joining our team? Check out our careers section!', 'color: #5a8fff; font-size: 16px;');
console.log('%cBuilt with passion and innovation 💡', 'color: #00eaff; font-size: 14px;');

// ======================= PERFORMANCE MONITORING =======================
window.addEventListener('load', () => {
  if ('performance' in window) {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`%cPage loaded in ${loadTime}ms`, 'color: #26d7ff; font-weight: bold;');
  }
});

// ======================= CONTACT FORM HANDLER =======================
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name') || 'CitySense AI Inquiry';
    const company = formData.get('company') || 'N/A';
    const email = formData.get('email') || '';
    const interest = formData.get('interest') || '';
    const message = formData.get('message') || '';

    const body = `
Name: ${name}
Organization: ${company}
Email: ${email}
Interest: ${interest}

${message}
`.trim();

    const mailtoLink = `mailto:hello@citysense.ai?subject=${encodeURIComponent(`CitySense AI - ${interest || 'New Inquiry'}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    if (contactStatus) {
      contactStatus.textContent = 'Opening your mail client…';
    }

    contactForm.reset();
  });
}
