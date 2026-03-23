/* =========================
   1) MOBILE NAVIGATION
   Handles opening and closing
   the mobile menu
========================= */

// Select the hamburger button from the page.
// querySelector() returns the first element that matches the CSS selector.
const hamburger = document.querySelector(".hamburger");

// Select the container that holds the navigation links.
const navLinks = document.querySelector(".nav-links");

// Select all anchor tags inside .nav-links.
// querySelectorAll() returns a NodeList of matching elements.
const navItems = document.querySelectorAll(".nav-links a");

// Only continue if both required elements exist in the HTML.
// This prevents errors if one of them is missing.
if (hamburger && navLinks) {
  // When the hamburger is clicked...
  hamburger.addEventListener("click", () => {
    // Toggle the "active" class on the hamburger itself.
    // This is useful if you want to animate the icon later.
    hamburger.classList.toggle("active");

    // Toggle the "active" class on the nav links container.
    // Your CSS uses .nav-links.active to show the mobile menu.
    navLinks.classList.toggle("active");
  });

  // Loop through each navigation link.
  navItems.forEach((link) => {
    // When a link is clicked...
    link.addEventListener("click", () => {
      // Remove the active class from the nav menu
      // so the mobile menu closes after selecting a link.
      navLinks.classList.remove("active");

      // Also remove active from the hamburger button
      // so its state resets visually.
      hamburger.classList.remove("active");
    });
  });
}

/* =========================
   2) SECTION SCROLL ANIMATION
   Reveals whole sections when
   they enter the viewport
========================= */

// Select all elements with the class .reveal.
// These are the elements that will animate into view.
const revealElements = document.querySelectorAll(".reveal");

// Create a new IntersectionObserver.
// This watches elements and tells us when they enter or leave the viewport.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    // entries is an array of observed elements whose visibility changed.
    entries.forEach((entry) => {
      // If the element is visible on screen, add the "show" class.
      // If not visible, remove the "show" class.
      // entry.isIntersecting is true when the element is inside the viewport.
      entry.target.classList.toggle("show", entry.isIntersecting);
    });
  },
  {
    // threshold: 0.15 means the observer triggers when
    // about 15% of the element is visible.
    threshold: 0.15,
  }
);

// Start observing each .reveal element.
revealElements.forEach((element) => {
  sectionObserver.observe(element);
});

/* =========================
   3) INDIVIDUAL CONTENT ANIMATION
   Reveals children inside each
   section one by one
========================= */

// Create another IntersectionObserver.
// This one handles staggered animation for .reveal-item elements inside sections.
const itemObserver = new IntersectionObserver(
  (entries) => {
    // Loop through each observed section whose visibility changed.
    entries.forEach((entry) => {
      // Inside the current section, find all children with .reveal-item.
      const items = entry.target.querySelectorAll(".reveal-item");

      // If the section is visible in the viewport...
      if (entry.isIntersecting) {
        // Loop through each item and reveal them one after another.
        items.forEach((item, index) => {
          // setTimeout delays each item's animation
          // based on its index to create a staggered effect.
          setTimeout(() => {
            item.classList.add("show");
          }, index * 150); // 150ms delay between each item
        });
      } else {
        // If the section is no longer visible,
        // remove the "show" class from all items.
        // This lets the animation happen again if the user scrolls back.
        items.forEach((item) => {
          item.classList.remove("show");
        });
      }
    });
  },
  {
    // Trigger when at least 15% of the section is visible.
    threshold: 0.15,
  }
);

// Observe every <section> element on the page.
document.querySelectorAll("section").forEach((section) => {
  itemObserver.observe(section);
});

/* =========================
   4) THEME SWITCH
   Saves theme preference in
   localStorage and restores it
========================= */

// Select the theme toggle button from the page.
const themeToggle = document.querySelector(".theme-toggle");

// Create a constant for the storage key.
// This avoids repeating the string "lightmode" everywhere.
const THEME_STORAGE_KEY = "lightmode";

// This function enables light mode.
const enableLightMode = () => {
  // Add the class "light-mode" to the body element.
  // Your CSS changes color variables when this class exists.
  document.body.classList.add("light-mode");

  // Save the user's preference in localStorage
  // so the theme stays the same after refresh.
  localStorage.setItem(THEME_STORAGE_KEY, "active");
};

// This function disables light mode.
const disableLightMode = () => {
  // Remove the class "light-mode" from the body.
  document.body.classList.remove("light-mode");

  // Save the disabled state in localStorage.
  localStorage.setItem(THEME_STORAGE_KEY, "inactive");
};

// Read the saved theme value from localStorage.
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

// If the saved value says light mode is active...
if (savedTheme === "active") {
  // ...turn on light mode.
  enableLightMode();
} else {
  // Otherwise, use dark mode by default.
  disableLightMode();
}

// Only add the click event if the button exists.
if (themeToggle) {
  // Listen for clicks on the toggle button.
  themeToggle.addEventListener("click", () => {
    // Check whether the body currently has the light-mode class.
    const isLightMode = document.body.classList.contains("light-mode");

    // If light mode is currently on, turn it off.
    // Otherwise, turn it on.
    if (isLightMode) {
      disableLightMode();
    } else {
      enableLightMode();
    }
  });
}