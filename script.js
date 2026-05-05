/* ============================================================
   PORTFOLIO - script.js
   Author: Jubayer
   ============================================================ */

/* ========================
   1. DARK MODE TOGGLE
   ======================== */

const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

// Load saved preference on page load
function loadTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

// Update the icon to match current theme
function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';

  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

// Run on page load
loadTheme();


/* ========================
   2. STICKY NAVBAR SHADOW
   ======================== */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ========================
   3. MOBILE HAMBURGER MENU
   ======================== */

const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});


/* ========================
   4. ACTIVE NAV LINK ON SCROLL
   ======================== */

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));

      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);


/* ========================
   5. SCROLL REVEAL ANIMATIONS
   ======================== */

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay for grouped items
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

// Stagger reveals inside grids/lists
function addStaggerDelay(selector, delayStep = 80) {
  const items = document.querySelectorAll(selector);
  items.forEach((el, i) => {
    el.dataset.delay = i * delayStep;
  });
}

addStaggerDelay('.project-card',   90);
addStaggerDelay('.service-card',   100);
addStaggerDelay('.stat-card',      80);
addStaggerDelay('.soft-skill-card',70);

revealEls.forEach(el => revealObserver.observe(el));


/* ========================
   6. TYPING EFFECT (HERO)
   ======================== */

const typingEl    = document.getElementById('typingText');
const typingWords = [
  'CSE Student',
  'Frontend Developer',
  'Problem Solver',
  'Web Enthusiast',
  'Python Learner',
];

let wordIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingTimer;

function typeEffect() {
  const currentWord = typingWords[wordIndex];

  if (isDeleting) {
    // Remove one character
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    // Full word typed — pause then start deleting
    speed = 1600;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Word deleted — move to next
    isDeleting = false;
    wordIndex  = (wordIndex + 1) % typingWords.length;
    speed = 400;
  }

  typingTimer = setTimeout(typeEffect, speed);
}

// Start typing after a short delay
setTimeout(typeEffect, 600);


/* ========================
   7. ANIMATED SKILL BARS
   ======================== */

const skillBars = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.dataset.width;
      entry.target.style.width = target + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

skillBars.forEach(bar => barObserver.observe(bar));


/* ========================
   8. ANIMATED STATS COUNTERS
   ======================== */

const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = Math.ceil(target / (duration / 16));
  let current    = 0;

  const counter = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }
    el.textContent = current;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));


/* ========================
   9. PROJECT FILTERING
   ======================== */

const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;

      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        // Re-trigger reveal if needed
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ========================
   10. CONTACT FORM VALIDATION
   ======================== */

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Helper: show an error message
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('error');
  error.textContent = message;
}

// Helper: clear an error
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('error');
  error.textContent = '';
}

// Basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;

  const nameVal    = document.getElementById('name').value.trim();
  const emailVal   = document.getElementById('email').value.trim();
  const subjectVal = document.getElementById('subject').value.trim();
  const messageVal = document.getElementById('message').value.trim();

  // Clear previous errors
  clearError('name',    'nameError');
  clearError('email',   'emailError');
  clearError('subject', 'subjectError');
  clearError('message', 'messageError');
  formSuccess.classList.remove('visible');

  // Validate name
  if (!nameVal) {
    showError('name', 'nameError', 'Please enter your name.');
    valid = false;
  }

  // Validate email
  if (!emailVal) {
    showError('email', 'emailError', 'Please enter your email.');
    valid = false;
  } else if (!isValidEmail(emailVal)) {
    showError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate subject
  if (!subjectVal) {
    showError('subject', 'subjectError', 'Please enter a subject.');
    valid = false;
  }

  // Validate message
  if (!messageVal) {
    showError('message', 'messageError', 'Please write your message.');
    valid = false;
  } else if (messageVal.length < 10) {
    showError('message', 'messageError', 'Message is too short (min 10 characters).');
    valid = false;
  }

  // If all valid — show success
  if (valid) {
    contactForm.reset();
    formSuccess.classList.add('visible');

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.remove('visible');
    }, 5000);
  }
});

// Live clear errors as user types
['name', 'email', 'subject', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearError(id, id + 'Error');
  });
});


/* ========================
   11. SMOOTH SCROLLING
   (Handled by CSS scroll-behavior: smooth,
   but this handles offset for fixed navbar)
   ======================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const top       = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ========================
   END OF SCRIPT
   ======================== */
