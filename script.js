/* =========================
   MOBILE NAVIGATION
========================= */

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
}

/* =========================
   SECTION SCROLL ANIMATION
========================= */

const revealElements = document.querySelectorAll(".reveal");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("show", entry.isIntersecting);
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => {
  sectionObserver.observe(element);
});

/* =========================
   INDIVIDUAL CONTENT ANIMATION
========================= */

const itemObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const items = entry.target.querySelectorAll(".reveal-item");

      if (entry.isIntersecting) {
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("show");
          }, index * 150);
        });
      } else {
        items.forEach((item) => {
          item.classList.remove("show");
        });
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll("section").forEach((section) => {
  itemObserver.observe(section);
});