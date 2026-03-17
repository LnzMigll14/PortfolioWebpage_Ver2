/* =========================
   MOBILE NAVIGATION
========================= */

// Select the hamburger button
const hamburger = document.querySelector(".hamburger");

// Select the container that holds the nav links
const navLinks = document.querySelector(".nav-links");

// When the hamburger is clicked:
// - toggle its own active state
// - toggle the nav menu visibility
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Select all links inside the navigation menu
const links = document.querySelectorAll(".nav-links a");

// When any nav link is clicked:
// - close the mobile menu
// - remove the hamburger active state
links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

/* =========================
   SECTION SCROLL ANIMATION
========================= */

// Select the main sections you want to animate as a whole
const revealElements = document.querySelectorAll(
  ".hero, .about, .stack, .projects"
);

// Create an IntersectionObserver
// This watches elements and tells us when they enter or leave the viewport
const observer = new IntersectionObserver(
  (entries) => {
    // Loop through all observed entries
    entries.forEach((entry) => {
      // If the section is visible on screen
      if (entry.isIntersecting) {
        // Add the "show" class to trigger the CSS animation
        entry.target.classList.add("show");
      } else {
        // Remove the "show" class when it leaves the screen
        // so it can animate again next time
        entry.target.classList.remove("show");
      }
    });
  },
  {
    // Trigger when at least 15% of the section is visible
    threshold: 0.15,
  }
);

// Add the base reveal class to each section
// Then start observing each one
revealElements.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

/* =========================
   INDIVIDUAL CONTENT ANIMATION
========================= */

// Select all elements with the reveal-item class
// These are the smaller contents inside sections
const revealItems = document.querySelectorAll(".reveal-item");

// Create another IntersectionObserver for staggered item animations
const itemObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Find all reveal-item elements inside the current section
      const items = entry.target.querySelectorAll(".reveal-item");

      // If the section is visible
      if (entry.isIntersecting) {
        // Animate each item one by one using a delay
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("show");
          }, index * 150); // each next item waits 150ms more
        });
      } else {
        // Remove the animation class when section leaves the screen
        // so the animation can happen again when scrolling back
        items.forEach((item) => {
          item.classList.remove("show");
        });
      }
    });
  },
  {
    // Trigger when at least 15% of the section is visible
    threshold: 0.15,
  }
);

// Observe every section
// Each section will control the animation of its own reveal-item children
document.querySelectorAll("section").forEach((section) => {
  itemObserver.observe(section);
});