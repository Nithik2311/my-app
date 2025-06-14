import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCg4eA8uZxnDR_kBd_TNbW_2UOmMYioBJM",
  authDomain: "automated-bus-scheduler.firebaseapp.com",
  projectId: "automated-bus-scheduler",
  storageBucket: "automated-bus-scheduler.appspot.com",
  messagingSenderId: "200917580915",
  appId: "1:200917580915:web:8b195513d3bdae4aeafe06"
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