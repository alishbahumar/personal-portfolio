/* =========================================================
   Alishba Umar — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader.classList.add("is-hidden"), 500);
  });

  /* ---------- Theme toggle (dark default) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  let theme = "dark";

  function applyTheme(t) {
    theme = t;
    if (t === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    themeToggle.setAttribute("aria-pressed", t === "light" ? "true" : "false");
  }

  themeToggle.addEventListener("click", () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  });

  /* ---------- Cursor glow (desktop only) ---------- */
  const glow = document.getElementById("cursorGlow");
  let glowActive = false;
  window.addEventListener("pointermove", (e) => {
    if (window.matchMedia("(pointer: fine)").matches) {
      if (!glowActive) { glow.classList.add("is-active"); glowActive = true; }
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }
  });

  /* ---------- Scroll to top (declared early: onScroll below calls it) ---------- */
  const scrollTopBtn = document.getElementById("scrollTop");
  function toggleScrollTop() {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 700);
  }

  /* ---------- Nav: scroll state + active link ---------- */
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main .section, .hero");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    toggleScrollTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active-link", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinksWrap = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    const isOpen = navLinksWrap.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  navLinksWrap.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinksWrap.classList.remove("is-open");
      hamburger.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  /* ---------- Scroll reveal ----------
     Elements are visible by default in CSS. Only once this script has
     confirmed it's running do we "arm" the fade-in-on-scroll effect —
     that way content is never dependent on JS to be seen. */
  const revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach((el) => el.classList.add("reveal-armed"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Safety net regardless.
  setTimeout(() => {
    document.querySelectorAll("[data-reveal]:not(.in-view)").forEach((el) => {
      el.classList.add("in-view");
    });
  }, 1200);

  /* ---------- Hero role switcher ---------- */
  const roles = [
    "Frontend Developer",
    "UI/UX Designer",
    "Java Developer",
    "Quran Tutor",
    "Problem Solver"
  ];
  const roleWords = ["interfaces", "products", "systems", "experiences"];
  const roleChip = document.getElementById("roleChip");
  const roleSwitch = document.getElementById("roleSwitch");
  let roleIdx = 0, wordIdx = 0;

  function cycleRole() {
    roleIdx = (roleIdx + 1) % roles.length;
    roleChip.style.opacity = 0;
    setTimeout(() => {
      roleChip.textContent = roles[roleIdx];
      roleChip.style.opacity = 1;
    }, 260);
  }
  function cycleWord() {
    wordIdx = (wordIdx + 1) % roleWords.length;
    roleSwitch.style.opacity = 0;
    setTimeout(() => {
      roleSwitch.textContent = roleWords[wordIdx];
      roleSwitch.style.opacity = 1;
    }, 260);
  }
  roleChip.style.transition = "opacity .26s ease";
  roleSwitch.style.transition = "opacity .26s ease";
  setInterval(cycleRole, 2600);
  setInterval(cycleWord, 3200);

  /* ---------- Count-up stats ----------
     Numbers already show their real value in HTML by default.
     JS only resets to 0 and counts up as a bonus animation. */
  const statEls = document.querySelectorAll(".hero-stat-num");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.textContent = "0";
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  statEls.forEach((el) => statObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Skill bars ----------
     Bars show their real percentage by default via CSS (--pct).
     JS "arms" them (drops to 0%) only if it's actually running,
     then animates back up to --pct when scrolled into view. */
  const skillBars = document.querySelectorAll(".skill-bar");
  skillBars.forEach((bar) => bar.classList.add("bar-armed"));

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          requestAnimationFrame(() => { bar.classList.remove("bar-armed"); });
          skillObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((bar) => skillObserver.observe(bar));

  // Safety net.
  setTimeout(() => {
    document.querySelectorAll(".skill-bar.bar-armed").forEach((bar) => bar.classList.remove("bar-armed"));
  }, 1200);

  /* ---------- Projects data + render + filter ---------- */
  const projects = [
    { title: "SafeX Website Redesign & Student Portal", cat: "UI/UX Design", desc: "A modern, responsive redesign of the SafeX platform plus a dedicated Student Portal and Internship Portal, focused on navigation and accessibility.", tags: ["Figma", "Balsamiq", "Miro"], img: "assets/projects/safex.jpg", video: "assets/projects/videos/safex-demo.mp4", github: "https://github.com/alishbahumar/SafeX-Solutions/tree/main" },
    { title: "Cartify — Smart Shopping App", cat: "UI/UX Design", desc: "A complete e-commerce mobile app: intuitive user flows, wireframes and interactive prototypes from onboarding to checkout.", tags: ["Figma", "Balsamiq"], img: "assets/projects/cartify.jpg", wireframes: "assets/projects/cartify-wireframes.jpg", video: "assets/projects/videos/cartify-demo.mp4", github: "https://github.com/alishbahumar/Code-Alpha/blob/main/README.md" },
    { title: "Cartify — Flow of Attractive & Real Project Wireframes", cat: "UI/UX Design", desc: "The full low-fidelity wireframe flow for Cartify, screen by screen: onboarding, login/signup, home & categories, product listing and detail pages, cart, checkout, notifications and profile — laid out exactly as planned in Balsamiq before moving to high-fidelity design.", tags: ["Balsamiq", "Wireframing", "UX Flow"], img: "assets/projects/cartify-flow/cartify-flow-01-onboarding.jpg", gallery: ["assets/projects/cartify-flow/cartify-flow-01-onboarding.jpg", "assets/projects/cartify-flow/cartify-flow-02-shop-product.jpg", "assets/projects/cartify-flow/cartify-flow-03-glasses-cart.jpg", "assets/projects/cartify-flow/cartify-flow-04-checkout-profile.jpg", "assets/projects/cartify-flow/cartify-flow-05-categories.jpg", "assets/projects/cartify-flow/cartify-flow-06-full-board.jpg"] },
    { title: "FoodVerse — Restaurant Website", cat: "Frontend Development", desc: "A responsive restaurant site with a modern homepage, menu section and online ordering interface.", tags: ["HTML", "CSS", "JavaScript"], img: "assets/projects/foodverse.jpg", video: "assets/projects/videos/foodverse.mp4", github: "https://github.com/alishbahumar/DecodeLabs-Frontend-Development-Internship/tree/main" },
    { title: "TravelEase — Travel Booking Website", cat: "Frontend Development", desc: "A premium travel-booking site with a hero video feel, destination browsing and a smooth booking flow.", tags: ["HTML", "CSS", "JavaScript"], img: "assets/projects/travelease.jpg", video: "assets/projects/videos/travelease.mp4", github: "https://github.com/alishbahumar/Synent-Technologies-web-development-and-design-internship" },
    { title: "SkyCast — Weather Dashboard", cat: "Frontend Development", desc: "A clean weather dashboard with live city search and current-conditions lookup, built on a public weather API.", tags: ["HTML", "CSS", "JavaScript", "API"], img: "assets/projects/skycast.jpg", video: "assets/projects/videos/skycast.mp4", github: "https://github.com/alishbahumar/Synent-Technologies-web-development-and-design-internship-week-3task/blob/main/README.md" },
    { title: "TaskFlow — Daily Task Manager", cat: "Frontend Development", desc: "A day-planning task manager with categories, priorities and a completion tracker, designed for a calm daily workflow.", tags: ["HTML", "CSS", "JavaScript"], img: "assets/projects/taskflow.jpg", video: "assets/projects/videos/taskflow.mp4", github: "https://github.com/alishbahumar/Synent-Technologies-web-development-and-design-internship-week-2-task" },
    { title: "Tajweed-ul-Makharij Learning App", cat: "UI/UX Design", desc: "A mobile learning app that teaches Tajweed and Makharij through an intuitive, engaging interface.", tags: ["Figma"], img: "assets/projects/tajweed.jpg", figma: "https://www.figma.com/design/6BLiJInKWYYhui3wJi3bpZ/Untitled?t=d0mDTEjvECqTVJ70-0" },
    { title: "Cinema Management System — Java & MySQL", cat: "Software Development", desc: "A desktop app for scheduling, ticket booking, seat allocation and payments, built with OOP and relational design.", tags: ["Java", "MySQL", "NetBeans"], img: "assets/projects/cinema-java.jpg", video: "assets/projects/videos/cinema-java.mp4", github: "https://github.com/alishbahumar/SOFTWAREENGINEERING-ALL-SEMESTER-FINAL-PROJECT/blob/main/OOP%20PROJECT%20REport.docx" },
    { title: "Cinema Management System — C++", cat: "Software Development", desc: "A console-based system with full CRUD for movies, customers and tickets, plus file handling and validation.", tags: ["C++", "Dev C++"], img: "assets/projects/cinema-cpp.jpg", video: "assets/projects/videos/cinema-cpp.mp4", github: "https://github.com/alishbahumar/SOFTWAREENGINEERING-ALL-SEMESTER-FINAL-PROJECT/blob/main/pf%20final%20proj.cpp" },
    { title: "Customer / Staff / Finance Management System", cat: "Software Development", desc: "A multi-module console suite built for the Programming Fundamentals final project — admin-driven staff records, customer handling and a finance module with deposits, withdrawals and account statements, all colour-coded for a clearer console UX.", tags: ["C++", "OOP", "File Handling"], img: "assets/projects/customer-staff-finance-mgmt.jpg", github: "https://github.com/alishbahumar/SOFTWAREENGINEERING-ALL-SEMESTER-FINAL-PROJECT/blob/main/pf%20final%20proj.cpp" },
    { title: "Student Management System", cat: "Software Development", desc: "A Java application managing student records, attendance and academic information with OOP principles.", tags: ["Java", "OOP"], img: "assets/projects/student-management.jpg", video: "assets/projects/videos/student-management.mp4", github: "https://github.com/alishbahumar/CodeAlpha-java-programing-Internship-tasks/blob/main/README.md" },
    { title: "Hotel Reservation System", cat: "Software Development", desc: "A hotel booking system with room management, customer registration and reservation tracking.", tags: ["Java", "MySQL"], img: "assets/projects/hotel-reservation.jpg", video: "assets/projects/videos/hotel-reservation.mp4", github: "https://github.com/alishbahumar/CodeAlpha-java-programing-Internship-tasks/blob/main/README.md" },
    { title: "AI Study Assistant Chatbot", cat: "Software Development", desc: "A conversational assistant that answers academic queries and guides students through study plans.", tags: ["Java", "AI APIs"], img: "assets/projects/chatbot-ai.jpg", video: "assets/projects/videos/chatbot-ai.mp4", github: "https://github.com/alishbahumar/CodeAlpha-java-programing-Internship-tasks/blob/main/README.md" },
    { title: "Smart Automatic Traffic Light System", cat: "Software Development", desc: "A sensor-driven traffic control concept with dynamic signal timing, documented end to end.", tags: ["Draw.io", "System Design"], img: "assets/projects/traffic-light.jpg", video: "assets/projects/videos/traffic-light.mp4" },
    { title: "SkillNova AI — Learning Platform", cat: "Frontend Development", desc: "An AI-powered learning platform with a premium UI, responsive layouts and interactive sections.", tags: ["HTML", "CSS", "Tailwind"], img: "assets/projects/skillnova.jpg", video: "assets/projects/videos/skillnova.mp4", github: "https://github.com/alishbahumar/Code-Alpha/blob/main/README.md" },
    { title: "Personal Portfolio Website", cat: "Frontend Development", desc: "A personal portfolio showcasing projects, internships and skills with smooth animation.", tags: ["React", "TypeScript", "Framer Motion"], img: "assets/projects/personal-portfolio.jpg", video: "assets/projects/videos/personal-portfolio.mp4", live: "https://relaxed-shortbread-c397d3.netlify.app" },
    { title: "Smart Appointment Booking System", cat: "UI/UX Design", desc: "A faculty-student appointment app with calendar-based scheduling, time-slot management, a student requests panel and profile settings.", tags: ["Figma"], img: "assets/projects/appointment-booking.jpg", figma: "https://www.figma.com/design/W3o4RnlkBYqNmCgvJv3xRM/Untitled?node-id=0-1&p=f&t=d0mDTEjvECqTVJ70-0" },
    { title: "Dice Rolling Game & To-Do List — C++ Console Apps", cat: "Software Development", desc: "Two console applications built during the Arch Technologies internship: a Dice Rolling Game with colored output, roll statistics and roll history, plus a To-Do List manager — both written in C++.", tags: ["C++", "Dev-C++", "OOP"], img: "assets/projects/arch-dice-rolling-game.jpg", video: "assets/projects/videos/arch-dice-rolling-game.mp4", github: "https://github.com/alishbahumar/Arch-Technologies-Intern-" },
    { title: "Beauty Workshop — Cosmetics Brand Magazine & Flyer", cat: "UI/UX Design", desc: "A complete print-design project for a fictional cosmetics brand: a multi-page product magazine and a promotional flyer, built with a cohesive visual identity, typography and layout across both formats.", tags: ["Canva", "Graphic Design", "Branding"], img: "assets/projects/beauty-workshop.jpg", pdf: "assets/projects/beauty-workshop-magazine.pdf", github: "https://github.com/alishbahumar/ICT-FINAL-PROJECT-OF-1ST-SEMESTR/tree/main" }
  ];

  const grid = document.getElementById("projectsGrid");
  const filterBar = document.getElementById("filterBar");

  function renderProjects() {
    grid.innerHTML = projects.map((p, i) => `
      <article class="project-card" data-cat="${p.cat}" data-reveal style="transition-delay:${(i % 3) * 60}ms">
        ${p.img ? `<div class="pc-thumb">${p.video ? `<button type="button" class="pc-video-badge" data-video="${p.video}" data-title="${p.title}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Watch demo
        </button>` : ""}<img src="${p.img}" alt="${p.title} preview" loading="lazy"></div>` : ""}
        <div class="pc-top">
          <span class="pc-cat">${p.cat}</span>
          <span class="pc-arrow" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12 12 4M6 4h6v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
        <h3 class="pc-title">${p.title}</h3>
        <p class="pc-desc">${p.desc}</p>
        <div class="pc-tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        ${p.wireframes ? `<button type="button" class="pc-wireframes" data-img="${p.wireframes}" data-title="${p.title} — Balsamiq Wireframes" data-issuer="Low-fidelity wireframes, onboarding to checkout">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/></svg>
          View wireframes
        </button>` : ""}
        ${p.gallery ? `<button type="button" class="pc-wireframes pc-github" data-gallery="${JSON.stringify(p.gallery).replace(/"/g, "&quot;")}" data-title="${p.title}" data-issuer="Balsamiq wireframe flow — screen 1 of ${p.gallery.length}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/></svg>
          View wireframe flow (${p.gallery.length})
        </button>` : ""}
        ${p.pdf ? `<a href="${p.pdf}" target="_blank" rel="noopener" class="pc-wireframes">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          View full magazine (PDF)
        </a>` : ""}
        ${p.figma ? `<a href="${p.figma}" target="_blank" rel="noopener" class="pc-wireframes pc-github">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4z"/><path d="M4 12c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z"/><path d="M4 4c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z"/><path d="M12 0h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4V0z"/><path d="M20 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/></svg>
          View in Figma
        </a>` : ""}
        ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="pc-wireframes pc-github">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>
          View live site
        </a>` : ""}
        ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="pc-wireframes pc-github">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.26 5.69.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"/></svg>
          View on GitHub
        </a>` : ""}
      </article>
    `).join("");

    // Re-observe new reveal elements
    grid.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("reveal-armed");
      revealObserver.observe(el);
    });

    grid.querySelectorAll(".pc-wireframes").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (btn.dataset.gallery) {
          openLightbox(JSON.parse(btn.dataset.gallery), btn.dataset.title, btn.dataset.issuer);
        } else {
          openLightbox(btn.dataset.img, btn.dataset.title, btn.dataset.issuer);
        }
      });
    });

    grid.querySelectorAll(".pc-video-badge").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openVideoLightbox(btn.dataset.video, btn.dataset.title);
      });
    });
  }
  renderProjects();

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    grid.querySelectorAll(".project-card").forEach((card) => {
      const match = filter === "all" || card.dataset.cat === filter;
      card.hidden = !match;
      if (match) card.classList.add("in-view");
    });
  });

  /* ---------- Scroll to top: click handler ---------- */
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Certificate lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxIssuer = document.getElementById("lightboxIssuer");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let lbGallery = null;
  let lbIndex = 0;
  let lbTitle = "";
  let lbBaseIssuer = "";

  function openLightbox(imgOrGallery, title, issuer) {
    lbTitle = title;
    lightboxTitle.textContent = title;
    const isGallery = Array.isArray(imgOrGallery);
    lbGallery = isGallery ? imgOrGallery : null;
    lbIndex = 0;
    lbBaseIssuer = issuer || "";

    if (isGallery) {
      lightboxCounter.textContent = `1 / ${imgOrGallery.length}`;
      lightboxIssuer.textContent = issuer;
      lightboxImg.src = imgOrGallery[0];
      lightboxImg.alt = `${title} — screen 1`;
      lightboxPrev.classList.toggle("is-hidden", imgOrGallery.length < 2);
      lightboxNext.classList.toggle("is-hidden", imgOrGallery.length < 2);
    } else {
      lightboxCounter.textContent = "";
      lightboxIssuer.textContent = issuer;
      lightboxImg.src = imgOrGallery;
      lightboxImg.alt = title;
      lightboxPrev.classList.add("is-hidden");
      lightboxNext.classList.add("is-hidden");
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbGallery = null;
  }
  function showLightboxStep(delta) {
    if (!lbGallery) return;
    lbIndex = (lbIndex + delta + lbGallery.length) % lbGallery.length;
    lightboxImg.src = lbGallery[lbIndex];
    lightboxImg.alt = `${lbTitle} — screen ${lbIndex + 1}`;
    lightboxCounter.textContent = `${lbIndex + 1} / ${lbGallery.length}`;
  }
  lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); showLightboxStep(-1); });
  lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); showLightboxStep(1); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open") || !lbGallery) return;
    if (e.key === "ArrowLeft") showLightboxStep(-1);
    if (e.key === "ArrowRight") showLightboxStep(1);
  });

  document.querySelectorAll(".cert-card-img").forEach((card) => {
    card.addEventListener("click", () => {
      openLightbox(card.dataset.img, card.dataset.title, card.dataset.issuer);
    });
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });

  /* ---------- Project video demo lightbox ---------- */
  const videoLightbox = document.getElementById("videoLightbox");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const videoLightboxTitle = document.getElementById("videoLightboxTitle");
  const videoLightboxClose = document.getElementById("videoLightboxClose");

  function openVideoLightbox(src, title) {
    lightboxVideo.src = src;
    videoLightboxTitle.textContent = title;
    videoLightbox.classList.add("is-open");
    videoLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxVideo.currentTime = 0;
    lightboxVideo.play().catch(() => {});
  }
  function closeVideoLightbox() {
    videoLightbox.classList.remove("is-open");
    videoLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
  }
  videoLightboxClose.addEventListener("click", closeVideoLightbox);
  videoLightbox.addEventListener("click", (e) => {
    if (e.target === videoLightbox) closeVideoLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoLightbox.classList.contains("is-open")) closeVideoLightbox();
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  const validators = {
    name: (v) => v.trim().length >= 2 || "Please enter your name.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address.",
    subject: (v) => v.trim().length >= 3 || "A short subject helps me reply faster.",
    message: (v) => v.trim().length >= 10 || "Message should be at least 10 characters."
  };

  function validateField(field) {
    const input = form.elements[field];
    const errorEl = document.getElementById(`err-${field}`);
    const row = input.closest(".form-row");
    const result = validators[field](input.value);
    if (result === true) {
      row.classList.remove("has-error");
      errorEl.textContent = "";
      return true;
    } else {
      row.classList.add("has-error");
      errorEl.textContent = result;
      return false;
    }
  }

  ["name", "email", "subject", "message"].forEach((field) => {
    form.elements[field].addEventListener("blur", () => validateField(field));
    form.elements[field].addEventListener("input", () => {
      if (form.elements[field].closest(".form-row").classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  // Submits via FormSubmit's AJAX endpoint so the page never reloads —
  // shows a clear success or error message right on the page instead.
  const formStatus = document.getElementById("formStatus");
  const ajaxAction = form.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = ["name", "email", "subject", "message"];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) return;

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-label").textContent = "Sending…";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    fetch(ajaxAction, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        const msg = ((data && data.message) || "").toLowerCase();
        const needsActivation = msg.includes("confirm") || msg.includes("activat") || msg.includes("pending");

        if (ok && data && data.success !== "false") {
          formStatus.textContent = "Thanks! Your message has been sent — I'll reply soon.";
          formStatus.classList.add("is-success");
          form.reset();
        } else if (needsActivation) {
          formStatus.textContent = "Almost there — check hafizaalishba.umar@gmail.com and click the FormSubmit activation link, then this form will work for everyone.";
          formStatus.classList.add("is-error");
        } else {
          throw new Error((data && data.message) || "Send failed");
        }
      })
      .catch(() => {
        formStatus.textContent = "Message couldn't be sent. Please email me directly at hafizaalishba.umar@gmail.com.";
        formStatus.classList.add("is-error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector(".btn-label").textContent = "Send message";
      });
  });

})();
