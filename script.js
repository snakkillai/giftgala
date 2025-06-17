import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js"

// Your web app's Firebase configuration - GET COMPLETE CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyDbM1fhLae8uk_Vblsu87pmpesu0PPRwts",
    authDomain: "giftgala-22a83.firebaseapp.com",
    databaseURL: "https://giftgala-22a83-default-rtdb.firebaseio.com",
    projectId: "giftgala-22a83",
    storageBucket: "giftgala-22a83.firebasestorage.app",
    messagingSenderId: "704180525083",
    appId: "1:704180525083:web:e1a017bf327074ecad80be"
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig); // Fixed: was using undefined 'appSettings'

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app);

// Create a reference to the 'messages' node in the database
// This is where all messages will be stored as a collection
const messagesInDB = ref(database, "messages");

// Get the form element and confirmation message element
const rsvpForm = document.getElementById('rsvp-form');
const email = document.getElementById('email');
const confirmationMessage = document.getElementById('confirmation-message');
const showList = document.getElementById('show-list');
const messageList = document.querySelector(".messages");
const attendanceDropdown = document.getElementById('attendance');
const messageField = document.getElementById('message-field'); // Get the message field
const body = document.body;

// Show/Hide message field based on attendance selection
attendanceDropdown.addEventListener('change', (event) => {
  // Check if the selected value is 'yes'
  if (event.target.value === 'yes') {
    // Show the message field
    messageField.style.display = 'block';
  } else {
    // Hide the message field
    messageField.style.display = 'none';
  }
});

// FIREBASE LISTENER: Set up real-time listener for messages
// This function runs whenever data in the 'messages' node changes
onValue(messagesInDB, function(snapshot) {
    // Clear the existing messages from the DOM to avoid duplicates
    clearMessagesFromDOM();
    
    // snapshot.val() returns the actual data from Firebase
    // If there's no data, it returns null, so we use an empty object as fallback
    const messages = snapshot.val() || {};
    
    // Convert the messages object into an array of message values
    // Object.values() extracts just the message content, ignoring Firebase's auto-generated keys
    const messageArray = Object.values(messages);
    
    // Loop through each message and add it to the DOM
    messageArray.forEach(function(messageText) {
        appendMessageToDOM(messageText);
    });
});

// FIREBASE WRITE FUNCTION: Save message to database
function saveMessageToFirebase(messageText) {
    // push() automatically generates a unique key for each new message
    // and adds the message to the 'messages' collection in Firebase
    push(messagesInDB, messageText)
        .then(() => {
            console.log("Message successfully saved to Firebase!");
        })
        .catch((error) => {
            console.error("Error saving message to Firebase:", error);
        });
}

// DOM MANIPULATION: Add message to the messages list in the HTML
function appendMessageToDOM(messageText) {
    // Create a new list item element
    const newMessageElement = document.createElement("li");
    
    // Set the text content of the list item to the message
    newMessageElement.textContent = messageText;
    
    // Add the new list item to the messages list in the DOM
    messageList.appendChild(newMessageElement);
}

// DOM MANIPULATION: Clear all messages from the HTML list
function clearMessagesFromDOM() {
    // Remove all child elements (list items) from the messages list
    messageList.innerHTML = "";
}

// Add event listener to the form submission
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission

  // Get the selected attendance value and message value
  const attendance = document.getElementById('attendance').value;
  const message = document.getElementById('message').value;
  
  // Display confirmation message based on attendance selection
  if (attendance === 'yes') {
    confirmationMessage.innerHTML = `🎉 Party on! We look forward to seeing you at the GIF Gala!`;
    body.style.backgroundImage = 'url("https://media.giphy.com/media/l2JHPB58MjfV8W3K0/giphy.gif")';
    
    // FIREBASE INTEGRATION: Save message to database only if attending and message exists
    if (message && message.trim() !== "") {
        saveMessageToFirebase(message.trim());
    }
    
  } else if (attendance === 'no') {
    confirmationMessage.innerHTML = '😔 We will miss you at the GIF Gala!';
    body.style.backgroundImage = 'url("https://media.giphy.com/media/JER2en0ZRiGUE/giphy.gif")';
    // Note: No message is saved to Firebase if attendance is 'no'
  }

  // Show the confirmation message
  confirmationMessage.style.display = 'block';

  // Reset the form
  rsvpForm.reset();
  
  // Hide message field after form reset
  messageField.style.display = 'none';
});

// Toggle visibility of messages list
showList.addEventListener('click', showMessages);

function showMessages() {
  // Check if the list is currently visible
  if (messageList.style.display === 'none') {
    // If not visible, make it visible
    messageList.style.display = 'flex';
    showList.textContent = 'Hide Messages';
  } else {
    // If already visible, hide it
    messageList.style.display = 'none';
    showList.textContent = 'Show Messages';
  }
}