document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Navbar Scroll Effect ─────────────────────────────────
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  // Initialize and listen to scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── 2. Mobile Menu Toggle ──────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      if (isOpen) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── 3. Scroll Reveal Animations ─────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // ── 4. Contact Form Submission ──────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');
  const contactSubmit = document.getElementById('contactSubmit');

  if (contactForm && contactFeedback && contactSubmit) {
    const originalSubmitText = contactSubmit.innerHTML;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset feedback status
      contactFeedback.textContent = '';
      contactFeedback.style.color = '';

      // Basic client-side validation check
      if (!contactForm.checkValidity()) {
        contactFeedback.textContent = 'Please fill out all required fields with valid information.';
        contactFeedback.style.color = '#ef4444'; // Red-orange error color
        contactForm.reportValidity();
        return;
      }

      // Update button to sending state
      contactSubmit.disabled = true;
      contactSubmit.innerHTML = `Sending... <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid currentColor; border-radius:50%; border-top-color:transparent; animation: spin 0.8s linear infinite; margin-left:8px;"></span>`;

      // Define CSS spin animation keyframe dynamically if not present
      if (!document.getElementById('spin-animation-style')) {
        const style = document.createElement('style');
        style.id = 'spin-animation-style';
        style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          contactFeedback.textContent = 'Thank you! Your message has been sent successfully.';
          contactFeedback.style.color = '#38bdf8'; // Theme cyan color
          contactForm.reset();
        } else {
          const data = await response.json();
          if (data && data.errors) {
            contactFeedback.textContent = data.errors.map(error => error.message).join(', ');
          } else {
            contactFeedback.textContent = 'Oops! There was a problem submitting your form. Please try again.';
          }
          contactFeedback.style.color = '#ef4444';
        }
      } catch (error) {
        contactFeedback.textContent = 'Could not connect to the server. Please check your network connection and try again.';
        contactFeedback.style.color = '#ef4444';
      } finally {
        contactSubmit.disabled = false;
        contactSubmit.innerHTML = originalSubmitText;
      }
    });
  }
});
