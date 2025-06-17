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

// Initialize Firebase app with your configuration
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app);

// Create a reference to the "compliments" node in your database
// This is where all compliments will be stored
const complimentsRef = ref(database, "compliments");

// Get references to HTML elements we'll interact with
const generateButton = document.getElementById('generateButton');
const complimentDisplay = document.getElementById('compliment-display');
const complimentForm = document.getElementById('complimentForm');
const complimentInput = document.getElementById('complimentInput');
const toggleFormButton = document.getElementById('toggleFormButton');
const submitButton = document.getElementById('submitButton');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Array to store compliments locally for faster random generation
let complimentsArray = [];

// Function to show/hide the submission form
toggleFormButton.addEventListener('click', () => {
    // Toggle the 'hidden' class to show/hide the form
    complimentForm.classList.toggle('hidden');
    
    // Update button text based on form visibility
    if (complimentForm.classList.contains('hidden')) {
        toggleFormButton.textContent = 'Add Kudos';
    } else {
        toggleFormButton.textContent = 'Hide Form';
    }
});

// Function to clear any existing messages
function clearMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Function to show success message
function showSuccessMessage(message) {
    clearMessages();
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

// Function to show error message
function showErrorMessage(message) {
    clearMessages();
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Function to validate compliment input
function validateCompliment(compliment) {
    // Remove whitespace and check if empty
    const trimmedCompliment = compliment.trim();
    
    if (trimmedCompliment.length === 0) {
        return { isValid: false, message: "Please enter a compliment!" };
    }
    
    if (trimmedCompliment.length < 5) {
        return { isValid: false, message: "Compliment must be at least 5 characters long." };
    }
    
    if (trimmedCompliment.length > 200) {
        return { isValid: false, message: "Compliment must be less than 200 characters." };
    }
    
    return { isValid: true, compliment: trimmedCompliment };
}

// Function to submit a new compliment to Firebase
async function submitCompliment() {
    // Get the compliment text from the input field
    const complimentText = complimentInput.value;
    
    // Validate the input
    const validation = validateCompliment(complimentText);
    
    if (!validation.isValid) {
        showErrorMessage(validation.message);
        return;
    }

    try {
        // Create a compliment object with the text and timestamp
        const complimentData = {
            text: validation.compliment,
            timestamp: Date.now(), // Current timestamp in milliseconds
            dateAdded: new Date().toISOString() // Human-readable date
        };

        /*
         * FIREBASE PUSH OPERATION EXPLAINED:
         * 
         * push() is a Firebase method that:
         * 1. Adds data to a database reference
         * 2. Automatically generates a unique key for each entry
         * 3. Returns a Promise that resolves when the operation completes
         * 
         * The structure in your database will look like:
         * compliments/
         *   ├── -N1234abcd5678efgh/
         *   │   ├── text: "You're amazing!"
         *   │   ├── timestamp: 1672531200000
         *   │   └── dateAdded: "2023-01-01T00:00:00.000Z"
         *   ├── -N5678ijkl9012mnop/
         *   │   ├── text: "You brighten everyone's day!"
         *   │   └── ...
         */
        
        // Push the compliment data to Firebase
        // The 'await' keyword waits for the operation to complete
        const result = await push(complimentsRef, complimentData);
        
        // If successful, show success message and clear the input
        showSuccessMessage("Your wonderful compliment has been added! 🎉");
        complimentInput.value = ''; // Clear the input field
        
        // Add the new compliment to our local array for immediate use
        complimentsArray.push(complimentData);
        
        console.log("Compliment added successfully with ID:", result.key);
        
    } catch (error) {
        // If there's an error (network issues, permission problems, etc.)
        console.error("Error adding compliment:", error);
        showErrorMessage("Oops! There was an error adding your compliment. Please try again.");
    }
}

// Function to load all compliments from Firebase
function loadCompliments() {
    /*
     * FIREBASE onValue LISTENER EXPLAINED:
     * 
     * onValue() sets up a real-time listener that:
     * 1. Triggers immediately with current data
     * 2. Triggers again whenever data changes
     * 3. Receives a 'snapshot' of the data at that reference
     * 
     * This means your app will automatically update when:
     * - New compliments are added by any user
     * - Existing compliments are modified
     * - Compliments are deleted
     */
    
    onValue(complimentsRef, (snapshot) => {
        // snapshot.val() gets the actual data
        const data = snapshot.val();
        
        // Clear the existing array
        complimentsArray = [];
        
        if (data) {
            // Convert the Firebase object to an array
            // Firebase stores data as objects with unique keys
            Object.values(data).forEach(compliment => {
                complimentsArray.push(compliment);
            });
            
            console.log(`Loaded ${complimentsArray.length} compliments from Firebase`);
        } else {
            console.log("No compliments found in database");
        }
    }, (error) => {
        // Handle any errors that occur while reading data
        console.error("Error loading compliments:", error);
        showErrorMessage("Error loading compliments from database.");
    });
}

// Function to generate and display a random compliment
function generateRandomCompliment() {
    if (complimentsArray.length === 0) {
        complimentDisplay.textContent = "No compliments available yet. Be the first to add one!";
        return;
    }
    
    // Generate a random index to select a compliment
    const randomIndex = Math.floor(Math.random() * complimentsArray.length);
    const randomCompliment = complimentsArray[randomIndex];
    
    // Display the compliment text
    complimentDisplay.textContent = randomCompliment.text;
}

// Event listener for the submit button
submitButton.addEventListener('click', submitCompliment);

// Event listener for Enter key in the input field
complimentInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        submitCompliment();
    }
});

// Event listener for the generate button
generateButton.addEventListener('click', generateRandomCompliment);

// Clear messages when user starts typing
complimentInput.addEventListener('input', clearMessages);

// Initialize the app by loading existing compliments
loadCompliments();

// Add some default compliments if the database is empty (optional)
// This will only run once to seed your database
setTimeout(() => {
    if (complimentsArray.length === 0) {
        const defaultCompliments = [
            "You have an amazing smile that lights up the room!",
            "Your kindness is a gift to everyone around you.",
            "You're stronger than you know and braver than you feel.",
            "Your creativity inspires others to think differently.",
            "You make the world a better place just by being you!"
        ];
        
        defaultCompliments.forEach(async (compliment) => {
            try {
                await push(complimentsRef, {
                    text: compliment,
                    timestamp: Date.now(),
                    dateAdded: new Date().toISOString()
                });
            } catch (error) {
                console.error("Error adding default compliment:", error);
            }
        });
        
        console.log("Added default compliments to database");
    }
}, 2000); // Wait 2 seconds to allow data to load first