// Import Firebase functions from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js"
import { getDatabase, ref, push, onValue, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js"

// Firebase configuration object - contains your project's unique identifiers
const firebaseConfig = {
  apiKey: "AIzaSyB1f_e8lo7eT156I9gNaApEjl40PHpRFFs",
  authDomain: "kudosdelight-c3a7c.firebaseapp.com",
  databaseURL: "https://kudosdelight-c3a7c-default-rtdb.firebaseio.com",
  projectId: "kudosdelight-c3a7c",
  storageBucket: "kudosdelight-c3a7c.firebasestorage.app",
  messagingSenderId: "4769790839",
  appId: "1:4769790839:web:5f0eb44512e205c6573f72"
};

// Initialize Firebase app using the configuration
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database service
const database = getDatabase(app);

// Reference the location in the database where compliments will be stored
const complimentsRef = ref(database, 'compliments');

// Select page elements
const generateButton = document.getElementById('generateButton');
const complimentDisplay = document.getElementById('compliment-display');
const complimentForm = document.getElementById('complimentForm');
const complimentInput = document.getElementById('complimentInput');
const toggleFormButton = document.getElementById('toggleFormButton'); // Make sure this element exists in your HTML

// Function to toggle visibility of the compliment submission form
toggleFormButton.addEventListener('click', () => {
  complimentForm.classList.toggle('hidden'); // Show or hide the form
  // Update the toggle button text based on visibility
  toggleFormButton.textContent = complimentForm.classList.contains('hidden') ? 'Add Kudos' : 'Hide Form';
});

// Function to handle the compliment form submission
complimentForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the default form submission behavior (like page refresh)

  const newCompliment = complimentInput.value.trim(); // Get the value from the input field and remove whitespace

  if (newCompliment !== '') {
    // If the input is not empty, proceed to add it to the database
    push(complimentsRef, newCompliment) // Push the compliment to the 'compliments' list in the database
      .then(() => {
        complimentInput.value = ''; // Clear the input field after successful submission
        complimentForm.classList.add('hidden'); // Hide the form again
        toggleFormButton.textContent = 'Add Kudos'; // Reset the toggle button text
      })
      .catch((error) => {
        console.error('Error adding compliment:', error); // Log any errors that occur
      });
  } else {
    alert('Please enter a compliment before submitting.'); // Alert if input is empty
  }
});
