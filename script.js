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
  // 2. HORIZONTAL GALLERY SCROLL
  // ==========================================
  const viewport = document.getElementById("gallery-viewport");
  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");

  if (viewport && prevBtn && nextBtn) {
    const scrollAmount = 300;

    prevBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      viewport.scrollBy({ left: scrollAmount, behavior: "smooth" });
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