// Initialize map
// use the mapbox SDK here
mapboxgl.accessToken = 'pk.eyJ1IjoidHBzc3Q1IiwiYSI6ImNrYmE0N3NnNDBjd2oycG8zM3M1MDJ4M3gifQ.htz4H8wNmkNAurq6boo3xg';

// Set map positioning
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-74.00597, 40.71427],
  zoom: 1
});

// Set marker positioning same as map positioning
const marker = new mapboxgl.Marker()
  .setLngLat([-74.00597, 40.71427])
  .addTo(map);

// Display error message
const errorMessage = function () {
  // Create div
  const div = document.createElement('div');
  // Add class
  div.className = 'alert';
  // Add text
  div.appendChild(document.createTextNode('Please enter username and password'));
  // Get parent
  const divContainer = document.getElementById('form-container');
  const form = document.querySelector('#login-form');
  // Insert alert
  divContainer.insertBefore(div, form);
  // Clear input entries
  document.getElementById('user').value = '';
  document.getElementById('password').value = '';
  // Timeout after 3 seconds
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
}

// Call to API to generate hello greeting in language based on IP Address
sayHello = (IP, user) => {
  const greeting = document.getElementById('hello');
  const userDisplay = document.getElementById('display-user');
  // API JSON endpoint to get hello greeting based on IP Address
  const endpoint = `https://fourtonfish.com/hellosalut/?ip=${IP}`;
  // Fetch JSON data to get greeting
  fetch(endpoint)
    .then(response => {
      return response.json()
    })
    .then(data => {
      // Greeting data
      console.log(data.hello)
      greeting.innerText = `${data.hello} `;
      userDisplay.innerText = `${user}!`;
    })
    .catch(err => {
      console.error(err)
    })
}

// Clear and disable inputs after login clicked
const clearInputs = () => {
  // Input variables for username & password
  const username = document.getElementById('user');
  const password = document.getElementById('password');
  // Reset input fields and disable them
  username.value = '';
  password.value = '';
  username.disabled = true;
  password.disabled = true;
}

// Event listener for login button clicked to get IP data from API
document.getElementById('submit-btn').addEventListener('click',
  // Get current position and pan to it
  function () {
    // UI variables
    const username = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    // Check for empty inputs then display username
    if (username === '' || password === '') {
      return errorMessage();
    }
    // API JSON endpoint to get users IP Address and latitude/longitude
    const endpoint = 'https://ip-api.com/json/?fields=status,message,query,lat,lon';
    // Fetch JSON data
    fetch(endpoint)
      .then(response => {
        return response.json()
      })
      .then(data => {
        // Location variables
        const latitude = data.lat;
        const longitude = data.lon;
        const ipAddress = data.query;
        sayHello(ipAddress, username);
        // Fly to coordinates
        map.flyTo({
          center: [longitude, latitude],
          essential: true,
          zoom: 10
        });
        // Set marker on new coordinates
        marker.setLngLat([longitude, latitude]);
      })
      .catch(err => {
        console.error(err)
      })
    // Call function to clear username and password inputs and disable
    clearInputs();
  });

// Event listener for logout button
document.getElementById('logout').addEventListener('click',
  function () {
    // Get greeting text 
    const greeting = document.getElementById('hello');
    // If greeting doesn't contiain welcome then reload
    if (greeting.innerText.includes('Welcome') === false) {
      location.reload();
    }
  });