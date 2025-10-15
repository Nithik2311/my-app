// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyB5IiXVcDFpbflTpamoHrx-VN5alCgS41g",
  authDomain: "automatedbusschedule.firebaseapp.com",
  projectId: "automatedbusschedule",
  storageBucket: "automatedbusschedule.firebasestorage.app",
  messagingSenderId: "479006348399",
  appId: "1:479006348399:web:1fcdb08b8753ea2432299a",
  measurementId: "G-RN1LMNRMXH"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test the connection immediately
console.log('Firebase initialized:', app);
console.log('Firestore initialized:', db);

export { db };
export default app;