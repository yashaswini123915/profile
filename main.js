// main.js
// All functionality, GSAP animations, forms, local comments, viewer count and small utilities.
// COMMENTS: Replace placeholders (EMAILJS_USER_ID, SERVICE_ID, TEMPLATE_ID, CountAPI namespace/key, social links in index.html, and asset paths).

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Basic helpers ----------
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => Array.from(document.querySelectorAll(s));

  // render year
  qs('#year').textContent = new Date().getFullYear();

  // Feather icons
  if (window.feather) feather.replace();

  // NAV: Hamburger toggle
  const hamburger = qs('#hamburger');
  const navList = qs('#navList');
  hamburger && hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    navList.style.display = open ? '' : 'flex';
    // animate hamburger lines
    hamburger.classList.toggle('open');
  });

  // Close mobile nav when a link clicked
  qsa('.nav-link').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth < 640) {
      navList.style.display = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }));

  // Smooth scroll to anchors handled by CSS scroll-behavior, but support for offset if needed:
  // (Optional: if using Lenis, hook here.)

  // ---------- Typed (typewriter) effect (vanilla) ----------
  const typedLines = [ "M. Rajani Yashaswini."," Web Developer.", "Frontend Developer."];
  let typedIndex = 0, charIndex = 0;
  const typedEl = qs('#typedLine');
  const cursorEl = qs('#typedCursor');
  let typingForward = true;

  function typeTick() {
    const current = typedLines[typedIndex];
    if (typingForward) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        typingForward = false;
        setTimeout(typeTick, 900); // pause at full
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        typingForward = true;
        typedIndex = (typedIndex + 1) % typedLines.length;
      }
    }
    setTimeout(typeTick, typingForward ? 60 : 28);
  }
  typeTick();
  // blink cursor
  setInterval(() => cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0', 500);

  // ---------- GSAP Animations (hero scroll-linked timeline) ----------
  // Wait until GSAP is available
  function initGSAP(){
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn('GSAP or ScrollTrigger not loaded yet.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const profile = qs('.hero-profile');
    const headline = qs('.hero-headline');

    // convert headline to a single element we can animate (scale/translate)
    // Timeline synced to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top+=200',
        scrub: 0.9,
        pin: false,
        // markers: true,
      }
    });

    // Move profile image from center to right and slightly back (back+right)
   // tl.to(profile, {
   //   x: () => window.innerWidth > 900 ? (window.innerWidth / 4) + 40 : 0,
  //    y: () => window.innerWidth > 900 ? -20 : 0,
    //  scale: 0.92,
     // ease: 'power3.out',
      //boxShadow: '0 30px 60px rgba(51,51,51,0.35)',
    //  duration: 1
    //}, 0);

    // scale the headline and translate left (reveal/zoom)
   // tl.to(headline, {
    //  scale: 1.12,
    //  x: () => window.innerWidth > 900 ? -60 : 0,
    //  transformOrigin: 'left center',
    //  ease: 'power3.out',
    //  duration: 1
    //}, 0);

    // Small parallax for hero copy
   // tl.to('.hero-copy', {
   //   y: -30,
   //   ease: 'none'
   // }, 0);

    // Projects area floating parallax
    gsap.to('#projectsGrid', {
      yPercent: -6,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    // Skill cards entrance (stagger)
    gsap.from('.skill', {
      y: 20, opacity: 0, stagger: 0.12, duration: 0.8,
      scrollTrigger: { trigger: '#skills', start: 'top 80%' }
    });

    // Projects cards hover sheen already via CSS; also add entrance
    gsap.from('.project-card', {
      y: 18, opacity: 0, stagger: 0.12, duration: 0.8,
      scrollTrigger: { trigger: '#projects', start: 'top 80%' }
    });

    // About image/card
    gsap.from('.about-card', {
      y: 30, opacity: 0, duration: 0.9, scrollTrigger: { trigger: '#about', start: 'top 80%' }
    });

    // Contact form entrance
    gsap.from('.contact-form', {
      y: 20, opacity: 0, duration: 0.8, scrollTrigger: { trigger: '#contact', start: 'top 80%' }
    });
  }

  // poll for gsap if not ready
  const gsapInterval = setInterval(() => {
    if (window.gsap && window.ScrollTrigger) {
      clearInterval(gsapInterval);
      initGSAP();
    }
  }, 100);

  // ---------- Projects marquee (continuous scroll) ----------
  (function initMarquee(){
    const marquee = qs('#marqueeInner');
    if (!marquee) return;
    // duplicate text so it scrolls continuously
    marquee.innerHTML = marquee.textContent + ' ' + marquee.textContent;
    // CSS animation fallback: we'll animate transform via GSAP for smoother control
    gsap.to('#marqueeInner', {
      xPercent: -50,
      ease: 'none',
      duration: 18,
      repeat: -1
    });

    // pause on hover
    const marqueeWrap = marquee.parentElement;
    marqueeWrap.addEventListener('mouseenter', () => gsap.globalTimeline.pause());
    marqueeWrap.addEventListener('mouseleave', () => gsap.globalTimeline.play());
  })();

  // ---------- Contact Form (EmailJS example) ----------
  // This demo uses EmailJS client-side. Replace the placeholders below with your own keys.
  // You can sign up at https://www.emailjs.com/ and create a service/template.
  const EMAILJS_USER_ID = 'EMAILJS_USER_ID'; // replace
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // replace
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // replace

  // init EmailJS (only if provided)
  if (window.emailjs) {
    try {
      emailjs.init(EMAILJS_USER_ID);
    } catch (e) {
      // ignore if init fails for demo
    }
  }

  const contactForm = qs('#contactForm');
  const toast = qs('#toast');

  function showToast(message, success = true) {
    toast.style.display = 'block';
    toast.style.background = success ? 'linear-gradient(90deg,var(--peach),var(--peach-2))' : 'linear-gradient(90deg,#ff8a8a,#ff6b6b)';
    toast.textContent = message;
    setTimeout(() => toast.style.display = 'none', 3500);
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const subject = qs('#subject').value.trim();
    const message = qs('#message').value.trim();

    // Basic client-side validation
    if (!name || !email || !message) {
      showToast('Please fill required fields', false);
      return;
    }

    // Use EmailJS if keys are provided
    if (EMAILJS_USER_ID && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && window.emailjs) {
      const templateParams = {
        from_name: name,
        from_email: email,
        subject,
        message
      };
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        showToast('Message sent — thank you!');
        contactForm.reset();
      } catch (err) {
        console.error('EmailJS error', err);
        showToast('Failed to send (EmailJS). Check console.', false);
      }
    } else {
      // Demo fallback: show success but explain what to replace
      showToast('Demo only: replace EmailJS keys in main.js to actually send emails.');
      contactForm.reset();
    }
  });
 //action of button in form---//
 gsap.from(".contact-form .btn", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  scrollTrigger: {
    trigger: ".contact-form",
    start: "top 80%",
  }
});



  // ---------- Viewer count (CountAPI with fallback) ----------
  (async function viewerCount(){
    const viewerSpan = qs('#viewerNumber');
    const NAMESPACE = 'replace-with-your-namespace'; // <--- replace with your namespace
    const KEY = 'replace-with-your-key'; // <--- replace with key
    if (NAMESPACE.includes('replace') || KEY.includes('replace')){
      // fallback: localStorage increment per session
      const localKey = 'local_viewers_v1';
      const prev = Number(localStorage.getItem(localKey) || 0);
      const val = prev + 1;
      localStorage.setItem(localKey, val);
      viewerSpan.textContent = val;
      return;
    }

    try {
      const res = await fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`);
      const data = await res.json();
      if (data && data.value) {
        viewerSpan.textContent = data.value;
      } else {
        throw new Error('unexpected response');
      }
    } catch (err) {
      console.warn('CountAPI failed', err);
      // fallback to local storage
      const localKey = 'local_viewers_v1';
      const prev = Number(localStorage.getItem(localKey) || 0);
      const val = prev + 1;
      localStorage.setItem(localKey, val);
      viewerSpan.textContent = val;
    }
  })();

  // ---------- Accessibility helpers ----------
  // ensure focusable elements show visible outline (already in CSS)
  // Add skip to content link if desired (not added to the template to keep design clean)

  // ---------- Small utilities ----------
  function escapeHtml(s){
    return (s || '').replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  }

  // expose a simple API in window for debugging / tweaks
  window.__pageDemo = {
    showToast,
    renderComments
  };
});
