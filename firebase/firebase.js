// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8pwS4cDnkqPSqw6iHUc7xBmNxguUTnuc",
  authDomain: "automated-bus-scheduler-7bf9b.firebaseapp.com",
  projectId: "automated-bus-scheduler-7bf9b",
  storageBucket: "automated-bus-scheduler-7bf9b.firebasestorage.app",
  messagingSenderId: "102212892639",
  appId: "1:102212892639:web:d408283f0518ec4847f66a",
  measurementId: "G-L2V0S6J12E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getAnalytics(app);

// Test the connection immediately
console.log('Firebase initialized:', app);
console.log('Firestore initialized:', db);

export { db };
export default app;