import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase config
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

// Initialize Firestore
const db = getFirestore(app);

// Test the connection immediately
console.log('Firebase initialized:', app);
console.log('Firestore initialized:', db);

export { db };
export default app;