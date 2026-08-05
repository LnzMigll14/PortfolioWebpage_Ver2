/*
 * Portfolio interactions
 *
 * Each feature lives in its own initialization function. This keeps variables
 * local to the feature that uses them and makes the file easier to navigate.
 */

// This class lets CSS provide a non-JavaScript fallback for the gallery.
document.documentElement.classList.add("js");

const THEME_STORAGE_KEY = "portfolio-theme";
const GITHUB_USERNAME = "LnzMigll14";
const GALLERY_AUTOPLAY_DELAY = 3500;
const GALLERY_TRANSITION =
  "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";

// ==================================================
// 1. COLOR THEME
// ==================================================

function initThemeSwitcher() {
  const lightModeButton = document.getElementById("light-mode-button");
  const darkModeButton = document.getElementById("dark-mode-button");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  // Stop safely if the theme controls are not included on the page.
  if (!lightModeButton || !darkModeButton) return;

  function setTheme(theme) {
    const lightModeIsActive = theme === "light";

    // CSS reads this data attribute to choose the correct color variables.
    document.documentElement.dataset.theme = theme;

    // Save the choice so it can be restored on the visitor's next page load.
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // aria-pressed tells assistive technology which option is selected.
    lightModeButton.setAttribute("aria-pressed", lightModeIsActive);
    darkModeButton.setAttribute("aria-pressed", !lightModeIsActive);

    // This controls the browser toolbar color on supported browsers.
    themeColor?.setAttribute(
      "content",
      lightModeIsActive ? "#f7f7f8" : "#0c0c0f",
    );
  }

  lightModeButton.addEventListener("click", () => setTheme("light"));
  darkModeButton.addEventListener("click", () => setTheme("dark"));

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  setTheme(savedTheme === "light" ? "light" : "dark");
}

// ==================================================
// 2. GITHUB CONTRIBUTION COUNT
// ==================================================

async function updateContributionCount() {
  const countElement = document.getElementById("contributions-count");
  if (!countElement) return;

  try {
    const response = await fetch(
      `https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub data");
    }

    const data = await response.json();
    let total = 0;

    /*
     * The API has returned different response shapes over time. These checks
     * let the portfolio read the total from any of the known formats.
     */
    if (typeof data.totalContributions === "number") {
      total = data.totalContributions;
    } else if (data.total && typeof data.total.lastYear === "number") {
      total = data.total.lastYear;
    } else if (Array.isArray(data.contributions)) {
      total = data.contributions.reduce(
        (sum, day) => sum + (day.count || 0),
        0,
      );
    }

    countElement.textContent = `${total} CONTRIBUTIONS IN THE LAST YEAR`;
  } catch (error) {
    // Keep the GitHub link useful even when the external API is unavailable.
    console.error("GitHub fetch error:", error);
    countElement.textContent = "VIEW CONTRIBUTIONS ON GITHUB";
  }
}

// ==================================================
// 3. INFINITE GALLERY CAROUSEL
// ==================================================

function initGalleryCarousel() {
  const galleryTrack = document.querySelector(".gallery-track");
  const previousButton = document.getElementById("gallery-prev");
  const nextButton = document.getElementById("gallery-next");

  if (!galleryTrack || !previousButton || !nextButton) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let isAnimating = false;
  let autoplayTimerId = null;

  // One movement equals the width of a gallery item plus the CSS gap.
  function getStepWidth() {
    const galleryItem = galleryTrack.querySelector(".gallery-item");
    if (!galleryItem) return 300;

    const trackStyles = window.getComputedStyle(galleryTrack);
    const gap = parseFloat(trackStyles.gap) || 20;

    return galleryItem.offsetWidth + gap;
  }

  function showNextImage() {
    if (isAnimating) return;
    isAnimating = true;

    galleryTrack.style.transition = GALLERY_TRANSITION;
    galleryTrack.style.transform = `translateX(-${getStepWidth()}px)`;

    galleryTrack.addEventListener(
      "transitionend",
      () => {
        /*
         * Moving the first item to the end after the animation creates the
         * illusion of an endless carousel without duplicating the images.
         */
        galleryTrack.style.transition = "none";
        galleryTrack.appendChild(galleryTrack.firstElementChild);
        galleryTrack.style.transform = "translateX(0)";
        isAnimating = false;
      },
      { once: true },
    );
  }

  function showPreviousImage() {
    if (isAnimating) return;
    isAnimating = true;

    const stepWidth = getStepWidth();

    // Put the final item before the first item, just outside the visible area.
    galleryTrack.style.transition = "none";
    galleryTrack.prepend(galleryTrack.lastElementChild);
    galleryTrack.style.transform = `translateX(-${stepWidth}px)`;

    /*
     * Reading offsetWidth forces the browser to apply the position above
     * before starting the animation back to zero.
     */
    void galleryTrack.offsetWidth;

    galleryTrack.style.transition = GALLERY_TRANSITION;
    galleryTrack.style.transform = "translateX(0)";

    galleryTrack.addEventListener(
      "transitionend",
      () => {
        isAnimating = false;
      },
      { once: true },
    );
  }

  function stopAutoplay() {
    if (!autoplayTimerId) return;

    clearInterval(autoplayTimerId);
    autoplayTimerId = null;
  }

  function startAutoplay() {
    // Autoplay stays disabled when reduced motion is requested.
    if (reduceMotion || autoplayTimerId) return;

    autoplayTimerId = setInterval(
      showNextImage,
      GALLERY_AUTOPLAY_DELAY,
    );
  }

  nextButton.addEventListener("click", showNextImage);
  previousButton.addEventListener("click", showPreviousImage);

  const galleryViewport = galleryTrack.parentElement;

  // Pause while the visitor is looking at or interacting with the gallery.
  galleryViewport.addEventListener("mouseenter", stopAutoplay);
  galleryViewport.addEventListener("mouseleave", startAutoplay);
  galleryViewport.addEventListener("focusin", stopAutoplay);
  galleryViewport.addEventListener("focusout", startAutoplay);

  // Avoid running the timer while the browser tab is hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  startAutoplay();
}

// ==================================================
// 4. GALLERY LIGHTBOX
// ==================================================

function initGalleryLightbox() {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-img");
  const modalCaption = document.getElementById("modal-caption");
  const closeButton = document.getElementById("modal-close");
  const galleryTriggers = document.querySelectorAll(".gallery-trigger");

  if (!modal || !modalImage || !closeButton) return;

  let lastFocusedElement = null;

  function openLightbox(trigger, image) {
    lastFocusedElement = trigger;

    modalImage.src = image.src;
    modalImage.alt = image.alt || "Enlarged photo";

    if (modalCaption) {
      modalCaption.textContent = image.alt || "";
    }

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    // Lock background scrolling while the dialog is open.
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    const wasOpen = modal.classList.contains("show");

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Return keyboard focus to the image that opened the lightbox.
    if (wasOpen && lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  galleryTriggers.forEach((trigger) => {
    const image = trigger.querySelector("img");
    if (!image) return;

    image.classList.add("clickable-image");
    trigger.addEventListener("click", () => {
      openLightbox(trigger, image);
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  // A click on the dark backdrop—but not the image—closes the dialog.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeLightbox();
    }
  });
}

// ==================================================
// 5. TYPING EFFECT
// ==================================================

function initTypingEffect() {
  const targetElement = document.getElementById("type-effect");

  // Typed is supplied by the external typed.js script in index.html.
  if (!targetElement || typeof Typed === "undefined") return;

  // Remove the static SEO fallback before Typed.js starts its animation.
  targetElement.textContent = "";

  new Typed("#type-effect", {
    strings: ["Web Developer.", "Virtual Assistant."],
    typeSpeed: 70,
    backSpeed: 60,
    loop: true,
  });
}

// Start the features after the page elements are available.
initThemeSwitcher();
updateContributionCount();
initGalleryCarousel();
initGalleryLightbox();

// Wait for all page resources so the external Typed library is ready.
window.addEventListener("load", initTypingEffect);
