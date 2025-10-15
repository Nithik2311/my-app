import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAx_BXnKxO4G2UWBPk02wYEUXn2sKNsqZg",
  authDomain: "automatedbus-1ec2c.firebaseapp.com",
  projectId: "automatedbus-1ec2c",
  storageBucket: "automatedbus-1ec2c.firebasestorage.app",
  messagingSenderId: "940424838307",
  appId: "1:940424838307:web:817f4c1913a88634dc1316",
  measurementId: "G-JX6SRLG8KZ"
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