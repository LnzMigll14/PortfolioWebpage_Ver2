document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. GITHUB CONTRIBUTIONS FETCHING
  // ==========================================
  const username = "LnzMigll14";
  const countElement = document.getElementById("contributions-count");

  async function fetchContributions() {
    try {
      const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub data");
      }

      const data = await response.json();
      
      let total = 0;
      if (typeof data.totalContributions === "number") {
        total = data.totalContributions;
      } else if (data.total && typeof data.total.lastYear === "number") {
        total = data.total.lastYear;
      } else if (Array.isArray(data.contributions)) {
        total = data.contributions.reduce((acc, day) => acc + (day.count || 0), 0);
      }

      if (countElement) {
        countElement.textContent = `${total} CONTRIBUTIONS IN THE LAST YEAR`;
      }
      
    } catch (error) {
      console.error("GitHub fetch error:", error);
      if (countElement) {
        countElement.textContent = "VIEW CONTRIBUTIONS ON GITHUB";
      }
    }
  }

  fetchContributions();

// ==========================================
// 2. SEAMLESS INFINITE LOOP GALLERY
// ==========================================
const track = document.querySelector(".gallery-track");
const prevBtn = document.getElementById("gallery-prev");
const nextBtn = document.getElementById("gallery-next");

if (track && prevBtn && nextBtn) {
  let isAnimating = false;

  // Calculates image width + gap dynamically
  function getStepWidth() {
    const item = track.querySelector(".gallery-item");
    if (!item) return 300;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return item.offsetWidth + gap;
  }

  // SLIDE NEXT: Glides left, then moves first item to the end
  function slideNext() {
    if (isAnimating) return;
    isAnimating = true;

    const step = getStepWidth();
    track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
    track.style.transform = `translateX(-${step}px)`;

    track.addEventListener(
      "transitionend",
      () => {
        track.style.transition = "none";
        track.appendChild(track.firstElementChild); // Re-order DOM
        track.style.transform = "translateX(0)";
        isAnimating = false;
      },
      { once: true }
    );
  }

  // SLIDE PREV: Prepends last item to front, then glides right
  function slidePrev() {
    if (isAnimating) return;
    isAnimating = true;

    const step = getStepWidth();

    // 1. Instantly shift last item to front off-screen
    track.style.transition = "none";
    track.prepend(track.lastElementChild);
    track.style.transform = `translateX(-${step}px)`;

    // 2. Force browser reflow to register instant position
    void track.offsetWidth;

    // 3. Animate into view
    track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
    track.style.transform = "translateX(0)";

    track.addEventListener(
      "transitionend",
      () => {
        isAnimating = false;
      },
      { once: true }
    );
  }

  nextBtn.addEventListener("click", slideNext);
  prevBtn.addEventListener("click", slidePrev);

  // AUTO-PLAY: Cycles automatically every 3.5 seconds
  let autoPlay = setInterval(slideNext, 3500);

  // Pause on hover
  track.parentElement.addEventListener("mouseenter", () => clearInterval(autoPlay));
  track.parentElement.addEventListener("mouseleave", () => {
    autoPlay = setInterval(slideNext, 3500);
  });
}

  // ==========================================
  // 3. IMAGE LIGHTBOX MODAL
  // ==========================================
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const modalCaption = document.getElementById("modal-caption");
  const modalClose = document.getElementById("modal-close");

  // Select profile image and gallery images
  const targetImages = document.querySelectorAll(".gallery-item img");

  targetImages.forEach((img) => {
    // Add hover cursor styling class
    img.classList.add("clickable-image");

    img.addEventListener("click", () => {
      if (!modal || !modalImg) return;
      
      modalImg.src = img.src;
      modalImg.alt = img.alt || "Enlarged photo";
      modalCaption.textContent = img.alt || "";
      
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    });
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore background scrolling
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    // Close when clicking overlay backdrop outside the image content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close when pressing the Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }
  

});