/* ============================================================
   COLGATE HIVE — MAIN JAVASCRIPT
   ============================================================ */

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");

  // Guard: if cursor elements are missing, bail out gracefully
  if (!cursor || !ring) return;

  let mx = 0,
    my = 0; // raw mouse position
  let rx = 0,
    ry = 0; // smoothed ring position
  let started = false;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!started) {
      // Snap ring to mouse on first move to avoid (0,0) flash
      rx = mx;
      ry = my;
      cursor.style.opacity = "1";
      ring.style.opacity = "1";
      started = true;
    }
  });

  function animateCursor() {
    // Dot follows mouse exactly
    cursor.style.left = mx - 6 + "px";
    cursor.style.top = my - 6 + "px";

    // Ring lags behind with easing
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx - 18 + "px";
    ring.style.top = ry - 18 + "px";

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();

/* ============================================================
   2. NAV — SCROLL GLASS EFFECT
   ============================================================ */
(function initNav() {
  const nav = document.getElementById("nav");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  // Nav CTA scrolls to CTA section
  document.getElementById("nav-cta-btn").addEventListener("click", () => {
    document.getElementById("cta").scrollIntoView({ behavior: "smooth" });
  });
})();

/* ============================================================
   3. HERO BUTTON SCROLL TARGETS
   ============================================================ */
(function initHeroButtons() {
  document.getElementById("hero-preorder-btn").addEventListener("click", () => {
    document.getElementById("cta").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("hero-learn-btn").addEventListener("click", () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  });
})();

/* ============================================================
   4. CANVAS — BIOLUMINESCENT PARTICLE ECOSYSTEM
   ============================================================ */
(function initCanvas() {
  const canvas = document.getElementById("canvas-bg");
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.02;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }

    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.phase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74,255,107,${a})`;
      ctx.fill();
    }
  }

  const PARTICLE_COUNT = 120;
  const CONNECTION_DIST = 120;
  const particles = Array.from(
    { length: PARTICLE_COUNT },
    () => new Particle(),
  );

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < CONNECTION_DIST) {
          const alpha = (1 - d / CONNECTION_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(74,255,107,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();
})();

/* ============================================================
   5. INTERSECTION OBSERVER — SCROLL REVEALS
   ============================================================ */
(function initReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ============================================================
   6. HOW-IT-WORKS — STAGGERED STEP REVEAL
   ============================================================ */
(function initSteps() {
  const steps = document.querySelectorAll(".step");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
  );

  steps.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
    observer.observe(el);
  });
})();

/* ============================================================
   7. PRODUCT REVEAL — CAPTION STAGGER
   ============================================================ */
(function initCaptions() {
  const caps = document.querySelectorAll(".caption-item");
  const productSection = document.getElementById("product-reveal");

  // Guard: bail if elements are missing
  if (!productSection || caps.length === 0) return;

  // Initial state
  caps.forEach((c) => {
    c.style.transform = "translateX(30px)";
    c.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          caps.forEach((cap, i) => {
            setTimeout(() => {
              cap.style.opacity = "1";
              cap.style.transform = "translateX(0)";
            }, i * 200);
          });
          observer.unobserve(productSection); // trigger once
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(productSection);
})();

/* ============================================================
   8. STATS — COUNT-UP ANIMATION
   ============================================================ */
(function initCountUp() {
  function countUp(el, target) {
    // Guard: if target is NaN or 0, just set it and return
    if (!target || isNaN(target)) {
      el.textContent = target || 0;
      return;
    }
    let current = 0;
    const step = target / 60;

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, 20);
  }

  const statNumbers = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          countUp(entry.target, target);
          observer.unobserve(entry.target); // count up once only
        }
      });
    },
    { threshold: 0.5 },
  );

  statNumbers.forEach((el) => observer.observe(el));
})();

/* ============================================================
   9. MOBILE HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();
