// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the "Get Space Images" button and the gallery container
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Your NASA API key
const apiKey = 'KL6nRWANgli6c3CdDu5xu83F4GccdegM98xhbO2I';

// Listen for button clicks
button.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    gallery.innerHTML = '<div class="placeholder"><p>Please select both start and end dates.</p></div>';
    return;
  }

  // Build the API URL with the selected dates and your API key
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Show a loading message before the gallery loads
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;

  // Fetch images from NASA's API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Check if we got an error from the API
      if (data.error) {
        gallery.innerHTML = `<div class="placeholder"><p>${data.error.message}</p></div>`;
        return;
      }

      // Clear the gallery
      gallery.innerHTML = '';

      // Loop through each item and add it to the gallery
      data.forEach(item => {
        // Create a new div for each entry (image or video)
        const div = document.createElement('div');
        div.className = 'gallery-item';

        if (item.media_type === 'image') {
          // If it's an image, show the image, title, and date
          div.innerHTML = `
            <!-- Show the space image -->
            <img src="${item.url}" alt="${item.title}" style="cursor:pointer;" />
            <!-- Show the image title -->
            <p><strong>${item.title}</strong></p>
            <!-- Show the image date -->
            <p>Date: ${item.date}</p>
          `;
          // Add a click event to open the modal with image details
          div.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(item);
          });
        } else if (item.media_type === 'video') {
          // If it's a video, show a video thumbnail or a clear link
          div.innerHTML = `
            <!-- Show a video icon and clickable link -->
            <a href="${item.url}" target="_blank" style="text-decoration:none; color:inherit;">
              <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
                <span style="font-size:48px; margin-bottom:10px;">🎬</span>
                <p><strong>${item.title}</strong></p>
                <p>Date: ${item.date}</p>
                <p style="color:#0b3d91; font-weight:bold;">Watch Video</p>
              </div>
            </a>
          `;
        }

        // Add the div to the gallery
        gallery.appendChild(div);
      });

      // If no images were found, show a message
      if (gallery.innerHTML === '') {
        gallery.innerHTML = '<div class="placeholder"><p>No images found for this date range.</p></div>';
      }
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = `<div class="placeholder"><p>Error: ${error.message}</p></div>`;
    });
});

// Get modal elements
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalClose = document.getElementById('modalClose');

// Function to open the modal with image details
function openModal(item) {
  // Set modal content
  modalImg.src = item.url;
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = `Date: ${item.date}`;
  modalExplanation.textContent = item.explanation;
  // Show the modal
  modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Close modal when clicking the close button or outside modal content
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
