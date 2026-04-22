document.addEventListener("DOMContentLoaded", () => {
  const carouselItems = document.querySelector('.carousel-items');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  prevBtn.addEventListener('click', () => {
    const itemWidth = carouselItems.querySelector('*').clientWidth;
    carouselItems.scrollBy({
      left: -itemWidth,
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    const itemWidth = carouselItems.querySelector('*').clientWidth;
    carouselItems.scrollBy({
      left: itemWidth,
      behavior: 'smooth'
    });
  });

  function updateButtonStates() {
    if (carouselItems.scrollLeft <= 0) {
      prevBtn.classList.add('disabled');
    } else {
      prevBtn.classList.remove('disabled');
    }
    if (carouselItems.scrollLeft + carouselItems.clientWidth >= carouselItems.scrollWidth) {
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.classList.remove('disabled');
    }
  }

  carouselItems.addEventListener('scroll', updateButtonStates);
  updateButtonStates();

  function updateMask() {
    const scrollLeft = carouselItems.scrollLeft;
    const scrollWidth = carouselItems.scrollWidth;
    const clientWidth = carouselItems.clientWidth;

    // Check if there is scrollable content on the left or right
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft + clientWidth < scrollWidth;

    // Update mask-image based on scrollable content
    let mask = "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";
    if (canScrollLeft && canScrollRight) {
      mask = "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)";
    } else if (canScrollLeft) {
      mask = "linear-gradient(to right, transparent 0%, black 5%, black 100%)";
    } else if (canScrollRight) {
      mask = "linear-gradient(to right, black 0%, black 95%, transparent 100%)";
    }

    carouselItems.style.maskImage = mask;
    carouselItems.style.webkitMaskImage = mask;

    // Update button states
    prevBtn.classList.toggle("disabled", !canScrollLeft);
    nextBtn.classList.toggle("disabled", !canScrollRight);
  }

  // Attach event listeners
  carouselItems.addEventListener("scroll", updateMask);
  window.addEventListener("resize", updateMask);

  // Initialize mask on page load
  updateMask();
})
