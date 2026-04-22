document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('contact-form');
  const result = document.getElementById('result');
  const loader = document.querySelector(".loader-overlay");

  const telInput = document.querySelector("#tel-input");
  
  // Auto-format telephone input
  telInput.addEventListener("input", (e) => {
    const input = e.target;
    const value = input.value.replace(/[^\d+]/g, ""); // Remove all non-digit characters except "+"
    const formattedValue = formatPhoneNumber(value);
    input.value = formattedValue;
  });

  function formatPhoneNumber(value) {
    console.log(value.length)
    if (value.startsWith("+1")) {
      if (value.length <= 3) {
        return value; // Keep "+1" as is
      } else if (value.length < 6) {
        return `${value.slice(0, 2)} ${value.slice(2, 5)}`; // Format as "+1 234"
      } else if (value.length < 10) {
        return `${value.slice(0, 2)} ${value.slice(2, 5)}-${value.slice(5)}`; // Format as "+1 234-567"
      }
      else {
        return `${value.slice(0, 2)} ${value.slice(2, 5)}-${value.slice(5, 8)}-${value.slice(8, 12)}`; // Format as "+1 234-567-8901"
      }
    } else {
      if (value.length <= 3) {
        return value; // Keep first 3 digits as is
      } else if (value.length <= 6) {
        return `${value.slice(0, 3)}-${value.slice(3)}`; // Format as "123-456"
      } else {
        return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`; // Format as "123-456-7890"
      }
    }
  }



  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const services = formData.getAll("services");
    const object = Object.fromEntries(
      [...formData].filter(([name]) => name !== "services")
    );
    object.services = services;
    console.log(object);
    const json = JSON.stringify(object);
    result.innerHTML = "Please wait...";
    loader.style.display = "flex";
    form.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json,
    })
      .then(async (response) => {
        let json = await response.json();
        loader.style.display = "none";
        form.disabled = false;
        if (response.status == 200) {
          result.innerHTML = "Form submitted successfully";
        } else {
          console.log(response);
          result.innerHTML = json.message;
        }
      })
      .catch(error => {
        console.log(error);
        loader.style.display = "none";
        result.innerHTML = "Something went wrong!";
        form.disabled = false;
      })
      .then(function() {
        form.reset();
        setTimeout(() => {
          result.style.display = "none";
        }, 3000);
      });
  });
})
