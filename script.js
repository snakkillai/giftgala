// script.js - JavaScript functionality for Kudos Delight Compliment Generator

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

// Select page elements
const generateButton = document.getElementById('generateButton');
const complimentDisplay = document.getElementById('compliment-display');
const complimentForm = document.getElementById('complimentForm');
const complimentInput = document.getElementById('complimentInput');

// Function to show/hide the submission form
toggleFormButton.addEventListener('click', () => {
  complimentForm.classList.toggle('hidden');
  complimentForm.classList.contains('hidden') ? toggleFormButton.textContent = 'Add Kudos' : toggleFormButton.textContent = 'Hide Form';
});

/** Challenge: Submit kudos 
  - Use the provided prompt to program the form to add compliments to the database.
**/

// Function to handle form submission
complimentForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const newCompliment = complimentInput.value.trim(); // Get the value from the input field and trim any leading/trailing whitespace

    if (newCompliment !== '') {
        // Check if the input is not empty
        push(complimentsRef, newCompliment) // Push the new compliment to the Firebase database
            .then(() => {
                complimentInput.value = ''; // Clear the input field
                complimentForm.classList.add('hidden'); // Hide the form after submission
                toggleFormButton.textContent = 'Add Kudos'; // Update the button text
            })
            .catch((error) => {
                console.error('Error adding compliment:', error);
            });
    }
});
