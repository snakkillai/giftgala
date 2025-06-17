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

const app = initializeApp(appSettings);
const database = getDatabase(app);
const messagesInDB = ref(database, "messages");

// Get the form element and confirmation message element
const rsvpForm = document.getElementById('rsvp-form');
const email = document.getElementById('email');
const confirmationMessage = document.getElementById('confirmation-message');
const showList = document.getElementById('show-list');
const messageList = document.querySelector(".messages")
const attendanceDropdown = document.getElementById('attendance');
const messageField = document.getElementById('message-field'); // Get the message field
const body = document.body;

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
  } else if (attendance === 'no') {
    confirmationMessage.innerHTML = '😔 We will miss you at the GIF Gala!';
    body.style.backgroundImage = 'url("https://media.giphy.com/media/JER2en0ZRiGUE/giphy.gif")';
  }

  // Show the confirmation message
  confirmationMessage.style.display = 'block';

  // Reset the form
  rsvpForm.reset();
});

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