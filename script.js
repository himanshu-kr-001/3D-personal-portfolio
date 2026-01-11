const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// 3D Tilt Card Animation
function initTiltCards() {
  const cards = document.querySelectorAll('.card, .gallery-item, .header-photo-container, .t-item');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });
}

function handleTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 20; // Decreased from /10 to /20
  const rotateY = (centerX - x) / 20; // Decreased from /10 to /20
  
  card.style.transform = `
    perspective(1000px) 
    rotateX(${rotateX}deg) 
    rotateY(${rotateY}deg) 
    translateZ(10px)
    ${card.classList.contains('t-item') ? 'translateY(-4px) scale(1.01)' : ''}
  `;
  
  card.classList.add('tilting');
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.transform = `
    perspective(1000px) 
    rotateX(0deg) 
    rotateY(0deg) 
    translateZ(0px)
    ${card.classList.contains('t-item') ? 'translateY(0px) scale(1)' : ''}
  `;
  card.classList.remove('tilting');
}

// Initialize tilt cards when DOM is loaded
document.addEventListener('DOMContentLoaded', initTiltCards);

// Loading Screen
const loadingScreen = $("#loadingScreen");
const loadingPercentage = $("#loadingPercentage");
const loadingStatus = $("#loadingStatus");
const loadingAudio = $("#loadingAudio");
const tapMagic = $("#tapMagic");

// Handle tap magic click
if (tapMagic) {
  tapMagic.addEventListener('click', () => {
    // Hide tap magic screen
    tapMagic.style.display = 'none';
    
    // Show loading screen
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
      
      // Start loading animation
      startLoading();
    }
  });
}

function startLoading() {
  if (!loadingScreen) return;
  
  let progress = 0;
  const loadingMessages = [
    "Initializing security protocols...",
    "Scanning portfolio assets...",
    "Loading cybersecurity modules...",
    "Establishing secure connection...",
    "Finalizing system setup..."
  ];
  
  // Play loading audio (only when user taps)
  if (loadingAudio) {
    loadingAudio.volume = 1.0;
    loadingAudio.play().then(() => {
      console.log('🎵 Loading audio started!');
    }).catch((error) => {
      console.log('🔇 Audio failed to play:', error);
    });
  }
  
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 8 + 2; // Slower increment between 2-10% (was 5-20%)
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Update final display
      if (loadingPercentage) loadingPercentage.textContent = "100%";
      if (loadingStatus) loadingStatus.textContent = "System ready!";
      
      // Fade out loading screen
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add("fade-out");
          setTimeout(() => {
            loadingScreen.style.display = "none";
            // Stop audio
            if (loadingAudio) {
              loadingAudio.pause();
              loadingAudio.currentTime = 0;
            }
            // Welcome message removed - portfolio loads directly
          }, 500);
        }
      }, 1000); // Longer pause before fade out (was 500ms)
    } else {
      // Update percentage
      if (loadingPercentage) loadingPercentage.textContent = Math.floor(progress) + "%";
      
      // Update status message
      const messageIndex = Math.floor((progress / 100) * loadingMessages.length);
      if (loadingStatus && loadingMessages[messageIndex]) {
        loadingStatus.textContent = loadingMessages[messageIndex];
      }
    }
  }, 300); // Slower update interval (was 200ms)
}

// Start loading when page loads - REMOVED (now starts on tap)
// window.addEventListener("load", () => {
//   startLoading();
// });

// Certificate View
const certView = $("#certView");
const certBackdrop = $("#certBackdrop");
const certFrame = $("#certFrame");
const certClose = $("#certClose");

function showCertificate(title, filePath) {
  if (!certView) return;
  
  // Update certificate title
  const certTitle = certView.querySelector('.cert-header h3');
  if (certTitle) certTitle.textContent = title;
  
  // Open PDF in new tab for full size viewing
  window.open(filePath, '_blank');
  
  // Also show in modal for quick preview (optional)
  // If you want only new tab, comment out the modal code below
  /*
  if (certFrame) {
    certFrame.src = filePath;
  }
  
  // Show certificate view
  certView.classList.add("active");
  certView.setAttribute("aria-hidden", "false");
  */
}

function toggleCertView() {
  if (!certView) return;
  
  const isActive = certView.classList.contains("active");
  
  if (isActive) {
    // Close certificate view
    certView.classList.remove("active");
    certView.setAttribute("aria-hidden", "true");
    // Clear iframe after closing
    setTimeout(() => {
      if (certFrame) certFrame.src = "";
    }, 300);
  } else {
    // This would only be used if we want to open without specific certificate
    certView.classList.add("active");
    certView.setAttribute("aria-hidden", "false");
  }
}

// Certificate click events
if (certClose) {
  certClose.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleCertView();
  });
}

if (certBackdrop) {
  certBackdrop.addEventListener("click", toggleCertView);
}

// Close certificate with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && certView && certView.classList.contains("active")) {
    toggleCertView();
  }
});

function openPhotoInNewTab(photoPath) {
  window.open(photoPath, '_blank');
}

// Photo Album View
const headerPhotoContainer = $("#headerPhotoContainer");
const photoAlbumView = $("#photoAlbumView");
const albumBackdrop = $("#albumBackdrop");
const albumClose = $("#albumClose");
const mainPhoto = $("#mainPhoto");
const zoomIn = $("#zoomIn");
const zoomOut = $("#zoomOut");
const zoomReset = $("#zoomReset");

let currentZoom = 1;

function togglePhotoAlbum() {
  if (!photoAlbumView) return;
  
  const isActive = photoAlbumView.classList.contains("active");
  
  if (isActive) {
    // Close album
    photoAlbumView.classList.remove("active");
  } else {
    // Open album
    photoAlbumView.classList.add("active");
    photoAlbumView.setAttribute("aria-hidden", "false");
    // Reset zoom when opening
    resetZoom();
  }
}

function updateZoom() {
  if (mainPhoto) {
    mainPhoto.style.transform = `scale(${currentZoom})`;
  }
}

function zoomInPhoto() {
  if (currentZoom < 3) {
    currentZoom += 0.25;
    updateZoom();
  }
}

function zoomOutPhoto() {
  if (currentZoom > 0.5) {
    currentZoom -= 0.25;
    updateZoom();
  }
}

function resetZoom() {
  currentZoom = 1;
  updateZoom();
}

if (headerPhotoContainer) {
  headerPhotoContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePhotoAlbum();
  });
}

if (zoomIn) {
  zoomIn.addEventListener("click", zoomInPhoto);
}

if (zoomOut) {
  zoomOut.addEventListener("click", zoomOutPhoto);
}

if (zoomReset) {
  zoomReset.addEventListener("click", resetZoom);
}

// Close album events
if (albumBackdrop) {
  albumBackdrop.addEventListener("click", togglePhotoAlbum);
}

if (albumClose) {
  albumClose.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePhotoAlbum();
  });
}

// Close album with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && photoAlbumView && photoAlbumView.classList.contains("active")) {
    togglePhotoAlbum();
  }
});

const navToggle = $(".nav-toggle");
const navMenu = $("#nav-menu");
const navLinks = $$(".nav-link");

function setMenuOpen(open) {
  if (!navMenu || !navToggle) return;
  navMenu.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    setMenuOpen(!navMenu.classList.contains("open"));
  });
}

navLinks.forEach((a) => {
  a.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("click", (e) => {
  if (!navMenu || !navToggle) return;
  const t = e.target;
  if (!(t instanceof Element)) return;
  const clickedInside = navMenu.contains(t) || navToggle.contains(t);
  if (!clickedInside) setMenuOpen(false);
});

const sections = [
  "about",
  "skills",
  "education",
  "certifications",
  "projects",
  "contact",
].map((id) => document.getElementById(id)).filter(Boolean);

const linkById = new Map(
  navLinks
    .map((l) => {
      const href = l.getAttribute("href") || "";
      const id = href.startsWith("#") ? href.slice(1) : "";
      return [id, l];
    })
    .filter(([id]) => id)
);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

    if (!visible) return;
    const id = visible.target.id;

    navLinks.forEach((l) => l.classList.remove("active"));
    const active = linkById.get(id);
    if (active) active.classList.add("active");
  },
  { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
);

sections.forEach((s) => observer.observe(s));

const skillEls = $$(".skill");
let skillsAnimated = false;

function animateSkills() {
  if (skillsAnimated) return;
  skillEls.forEach((el) => {
    const level = Number(el.getAttribute("data-level") || "0");
    const fill = $(".fill", el);
    if (fill) fill.style.width = `${Math.max(0, Math.min(100, level))}%`;
  });
  skillsAnimated = true;
}

const skillsSection = document.getElementById("skills");
if (skillsSection) {
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        animateSkills();
        skillsObserver.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  skillsObserver.observe(skillsSection);
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const driveGate = document.getElementById("driveGate");
const driveGateContinue = document.getElementById("driveGateContinue");

const welcome = document.getElementById("welcome");
const welcomeText = document.getElementById("welcomeText");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function typeLine(el, line, { min = 80, max = 120, jitter = 0.15 } = {}) {
  const reduced = prefersReducedMotion();
  const baseMin = reduced ? 20 : min;
  const baseMax = reduced ? 40 : max;
  const baseJitter = reduced ? 0 : jitter;

  el.textContent = "";
  for (let i = 0; i < line.length; i += 1) {
    el.textContent += line[i];
    const r = Math.random();
    const spike = r < baseJitter ? rand(100, 200) : 0;
    await sleep(rand(baseMin, baseMax) + spike);
  }
}

async function runWelcome() {
  if (!welcome || !welcomeText) return;
  
  // Add small delay before showing welcome
  await sleep(500);
  welcome.classList.add("show");

  // Unique greeting messages with different styles
  const greetings = [
    { text: "HELLO", delay: 1500 },
    { text: "NAMASTE 🙏", delay: 2000 },
    { text: "RADHE RADHE 🌟", delay: 2500 }
  ];

  for (let i = 0; i < greetings.length; i += 1) {
    const greeting = greetings[i];
    
    // Clear text and type new greeting
    welcomeText.textContent = "";
    await typeLine(welcomeText, greeting.text);
    
    // Unique delay for each greeting
    await sleep(greeting.delay);
    
    // Fade out effect before clearing
    welcomeText.style.opacity = "0";
    await sleep(400);
    welcomeText.style.opacity = "1";
    welcomeText.textContent = "";
    
    // Short pause before next greeting
    await sleep(300);
  }

  // Final fade out
  welcome.classList.add("hide");
  await sleep(1000);
  welcome.remove();
}

function showDriveGate() {
  if (!driveGate) return;
  driveGate.classList.add("show");
  driveGate.setAttribute("aria-hidden", "false");
}

function hideDriveGate() {
  if (!driveGate) return;
  driveGate.classList.remove("show");
  driveGate.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    if (driveGate && driveGate.parentElement) driveGate.remove();
  }, 480);
}

function startIntroSequence() {
  if (welcome && welcomeText) runWelcome();
}

// if (driveGate) {
//   showDriveGate();

//   let proceeded = false;
//   const autoMs = 6500;

//   const proceed = () => {
//     if (proceeded) return;
//     proceeded = true;
//     hideDriveGate();
//     window.setTimeout(() => startIntroSequence(), 260);
//   };

//   if (driveGateContinue) {
//     driveGateContinue.addEventListener("click", proceed);
//   }

//   window.setTimeout(proceed, autoMs);
// } else {
  startIntroSequence();
// }

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

let scrollRaf = 0;
function onScroll() {
  if (scrollRaf) return;
  scrollRaf = window.requestAnimationFrame(() => {
    scrollRaf = 0;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const t = clamp01(window.scrollY / max);

    const g1x = 18 + t * 22;
    const g1y = 8 + t * 18;
    const g2x = 82 - t * 18;
    const g2y = 22 + t * 30;
    const g3x = 54 - t * 10;
    const g3y = 92 - t * 30;

    doc.style.setProperty("--g1x", `${g1x}%`);
    doc.style.setProperty("--g1y", `${g1y}%`);
    doc.style.setProperty("--g2x", `${g2x}%`);
    doc.style.setProperty("--g2y", `${g2y}%`);
    doc.style.setProperty("--g3x", `${g3x}%`);
    doc.style.setProperty("--g3y", `${g3y}%`);
    doc.style.setProperty("--bg-mix", String(t));
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const canvas = document.getElementById("particles");
const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
let w = 0;
let h = 0;
let particles = [];
let rafId = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = Math.floor(window.innerWidth);
  h = Math.floor(window.innerHeight);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const target = Math.round(Math.min(90, Math.max(35, (w * h) / 22000)));
  if (particles.length > target) particles = particles.slice(0, target);
  while (particles.length < target) {
    particles.push({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(1.1, 2.6),
      vx: rand(-0.22, 0.22),
      vy: rand(-0.18, 0.18),
      a: rand(0.22, 0.65),
      hue: rand(195, 285),
    });
  }
}

function stepParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, w, h);

  const t = Number(getComputedStyle(document.documentElement).getPropertyValue("--bg-mix")) || 0;
  const linkDist = 125;
  const glowBoost = 0.9 + t * 0.6;

  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    const alpha = p.a * glowBoost;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 100%, 72%, ${alpha})`;
    ctx.shadowColor = `hsla(${p.hue}, 100%, 72%, ${Math.min(1, alpha + 0.12)})`;
    ctx.shadowBlur = 26;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist > linkDist) continue;
      const k = 1 - dist / linkDist;
      const alpha = 0.14 * k * glowBoost;
      const hue = (a.hue + b.hue) * 0.5;
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 100%, 72%, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue}, 100%, 72%, ${alpha * 0.55})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  rafId = window.requestAnimationFrame(stepParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  rafId = window.requestAnimationFrame(stepParticles);
}

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function setError(fieldId, message) {
  const box = document.querySelector(`[data-error-for="${fieldId}"]`);
  if (box) box.textContent = message || "";
}

function getValue(id) {
  const el = document.getElementById(id);
  if (!el) return "";
  return (el.value || "").trim();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function validate() {
  const name = getValue("name");
  const email = getValue("email");
  const message = getValue("message");

  let ok = true;

  setError("name", "");
  setError("email", "");
  setError("message", "");
  if (statusEl) statusEl.textContent = "";

  if (name.length < 2) {
    setError("name", "Please enter your name (min 2 characters).");
    ok = false;
  }

  if (!validateEmail(email)) {
    setError("email", "Please enter a valid email address.");
    ok = false;
  }

  if (message.length < 10) {
    setError("message", "Please write a message (min 10 characters).");
    ok = false;
  }

  return { ok, name, email, message };
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const v = validate();
    if (!v.ok) {
      if (statusEl) statusEl.textContent = "Please fix the errors above.";
      return;
    }

    if (statusEl) statusEl.textContent = "Sending message...";

    try {
      // Create email content and send using Web3Forms or similar free service
      const formData = new FormData();
      formData.append('access_key', '7ab15219-be58-48a3-ba55-788e9a374740');
      formData.append('name', v.name);
      formData.append('email', v.email);
      formData.append('message', v.message);
      formData.append('subject', 'Message from Portfolio Contact Form');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        if (statusEl) statusEl.textContent = "✅ Message sent successfully! I'll get back to you soon.";
        form.reset();
        ["name", "email", "message"].forEach((id) => setError(id, ""));

        // Clear success message after 5 seconds
        setTimeout(() => {
          if (statusEl) statusEl.textContent = "";
        }, 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      // Show error and suggest alternative
      if (statusEl) {
        statusEl.textContent = "❌ Unable to send directly. Please email me at hk86631@gmail.com";
        statusEl.style.color = "#ff6b6b";
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.textContent = "";
          statusEl.style.color = "";
        }
      }, 8000);
    }
  });
}
