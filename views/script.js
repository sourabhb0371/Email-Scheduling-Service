// Select form and popup elements
const form = document.getElementById('user-form');
const popup = document.getElementById('success-popup');
const popupMessage = document.getElementById('popup-message');
const closePopupBtn = document.querySelector('.close-popup-btn');

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent traditional form submission

  // Collect form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Send data to the server
  fetch('/template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // Show the success popup with a message
        popupMessage.textContent = result.message;
        popup.classList.remove('hidden');
      } else {
        alert('Something went wrong!');
      }
    })
    .catch((error) => console.error('Error:', error));
});

// Handle popup close
closePopupBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
});
