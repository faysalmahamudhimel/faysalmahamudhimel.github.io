// Skills data rendered in the Core Expertise section.
const expertise = [
  { name: "C", iconClass: "devicon-c-plain colored" },
  { name: "Java", iconClass: "devicon-java-plain colored" },
  { name: "HTML5", iconClass: "devicon-html5-plain colored" },
  { name: "CSS3", iconClass: "devicon-css3-plain colored" },
  { name: "JavaScript", iconClass: "devicon-javascript-plain colored" },
  { name: "Git", iconClass: "devicon-git-plain colored" },
  { name: "GitHub", iconClass: "devicon-github-original" },
  { name: "VS Code", iconClass: "devicon-vscode-plain colored" }
];

const grid = document.getElementById("skills-grid");
let lastFocusedElement = null;

function renderIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

// EmailJS settings for the contact form.
const emailConfig = {
  publicKey: "00vm3xXh-hV7IaJHI",
  serviceId: "service_fsyp1do",
  templateId: "template_rnfrz5t"
};

// Build skill cards from the expertise array.
if (grid) {
  grid.innerHTML = expertise.map(skill => `
    <div class="card skill-card">
      <i class="skill-icon ${skill.iconClass}" aria-hidden="true"></i>
      <span class="skill-name">${skill.name}</span>
    </div>
  `).join("");
}

// Reveal content smoothly as it enters the viewport.
const revealItems = document.querySelectorAll([
  ".section > .title",
  ".section > .title-line",
  ".about-feature",
  ".grid-2 > .card",
  ".stack > .card",
  ".certificates-grid > .card",
  ".skills-grid > .card",
  ".projects-grid > .card",
  ".footer .title",
  ".footer .title-line",
  ".footer-grid > .card",
  ".footer-logo"
].join(", "));

if (revealItems.length) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
}

// Highlight the active navigation link while scrolling through sections.
const sectionLinks = document.querySelectorAll('.nav a[href^="#"]');
const sections = Array.from(sectionLinks)
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNav(sectionId) {
  sectionLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + sectionId);
  });
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleSection) {
      setActiveNav(visibleSection.target.id);
    }
  }, {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.15, 0.35, 0.6]
  });

  sections.forEach(section => sectionObserver.observe(section));
  setActiveNav(sections[0].id);
}

// Certificate modal controls.
function openModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  renderIcons();

  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.open")) {
    document.body.classList.remove("modal-open");
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

// Close open certificate modal with the Escape key.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.open").forEach(modal => modal.classList.remove("open"));
    document.querySelectorAll(".modal").forEach(modal => modal.setAttribute("aria-hidden", "true"));
    document.body.classList.remove("modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }
});

// Initialize EmailJS only when the CDN script is available.
if (window.emailjs) {
  emailjs.init({
    publicKey: emailConfig.publicKey
  });
}

// Send contact form data through EmailJS.
function sendEmail(e) {
  e.preventDefault();
  const form = e.target;
  const submitButton = document.getElementById("email-submit");
  const status = document.getElementById("form-status");
  const email = document.getElementById("f-email").value;

  document.getElementById("reply-to").value = email;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i data-lucide="loader"></i> Sending...';
  status.textContent = "";
  status.className = "form-status";
  renderIcons();

  if (!window.emailjs) {
    status.textContent = "Email service is not loaded. Please check your internet connection.";
    status.classList.add("error");
    submitButton.disabled = false;
    submitButton.innerHTML = '<i data-lucide="send"></i> Send Message';
    renderIcons();
    return;
  }

  emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, form)
    .then(() => {
      status.textContent = "Thanks. Your message has been sent successfully.";
      status.classList.add("success");
      form.reset();
    })
    .catch(() => {
      status.textContent = "Message failed to send. Please check your connection and try again.";
      status.classList.add("error");
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i data-lucide="send"></i> Send Message';
      renderIcons();
    });
}

// Footer copyright year and Lucide icon rendering.
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}
renderIcons();
