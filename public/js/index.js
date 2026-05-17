document.addEventListener("DOMContentLoaded", () => {

  // initially close the hamburger menu if left open (if going back a page)
  const hamburgerCheckbox = document.querySelector("hamburger input[type='checkbox']");
  if (hamburgerCheckbox.checked) {
    hamburgerCheckbox.checked = false;
  }

  const elementsToAnimate = document.querySelectorAll('.img-wrapper, .card, .flex-card, .text-div, .pick-service-div, .dropdown-label');

  elementsToAnimate.forEach(element => {
    element.classList.add('will-animate');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-viewport');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.will-animate').forEach(element => {
    observer.observe(element);
  });
})
