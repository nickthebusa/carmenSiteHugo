document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.querySelector("#dropdown");
  const menuOptions = document.querySelectorAll(".section-dropdown span");
  const pageOptions = document.querySelectorAll(".pick-service-div");
  const pickServicePage = document.querySelector(".pick-service-page");

  // Maintain a reference to the currently selected service element
  let currentSelectedServiceElement = null;

  // Function to update the UI based on the service ID
  function updateUIService(serviceId) {
    // Remove 'selected' class from the previously selected service, if any
    if (currentSelectedServiceElement) {
      currentSelectedServiceElement.classList.remove("selected");
    }
    // Hide all service detail pages (assuming they all have the 'service' class)
    document.querySelectorAll('.service').forEach(serviceDiv => {
      serviceDiv.classList.remove("selected");
    });

    // Hide the pick service page initially
    pickServicePage.style.display = "none";

    if (serviceId === 'pickServicePage') {
      pickServicePage.style.display = "block";
      currentSelectedServiceElement = null;
    } else {
      // Show the specific service detail page
      const targetService = document.querySelector(`#${serviceId}`);
      if (targetService) {
        targetService.classList.add("selected");
        currentSelectedServiceElement = targetService;
      } else {
        // Fallback if serviceId is invalid, go back to pick service page
        console.warn(`Service with ID ${serviceId} not found. Returning to pick service page.`);
        updateUIService('pickServicePage');
        history.replaceState({ showingDetails: false, serviceId: 'pickServicePage' }, "", "services.html");
        return;
      }
    }
    checkbox.checked = false;
  }

  // Function to handle changing the service, including history
  function changeService(serviceId, pushNewState = true) {
    // Update the UI immediately
    updateUIService(serviceId);

    const state = { showingDetails: (serviceId !== 'pickServicePage'), serviceId };
    const url = (serviceId === 'pickServicePage') ? "services.html" : `?service=${serviceId}`;

    if (pushNewState) {
      history.pushState(state, "", url);
    } else {
      // For initial load or when replacing the current state
      history.replaceState(state, "", url);
    }
  }


  // --- Event Listeners for Service Selection ---
  menuOptions.forEach(ele => ele.addEventListener("click", () => changeService(ele.dataset.value)));
  pageOptions.forEach(ele => ele.addEventListener("click", () => changeService(ele.dataset.value)));

  // --- Popstate Event Listener (Browser Back/Forward) ---
  window.addEventListener("popstate", (event) => {
    // DO NOT preventDefault() here. The browser has already changed the URL.
    // event.state is crucial for popstate
    const state = event.state; if (state && state.showingDetails) {
      // going back/forward to a service detail page
      updateUIService(state.serviceId);
    } else {
      // going back/forward to the 'pick service page' or initial state
      updateUIService('pickServicePage');
    }
  });

  // --- Initial Page Load Handling ---
  window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

    if (urlParams.has("service")) {
      const serviceId = urlParams.get("service");
      // Use changeService with pushNewState = false to replace the initial state
      changeService(serviceId, false);
    } else if (currentPath === "services.html") {
      // If the URL is exactly services.html without a query param
      changeService('pickServicePage', false);
    } else {
      // Fallback for other URLs, assume we want to show the pick service page
      changeService('pickServicePage', false);
    }
  });
});
