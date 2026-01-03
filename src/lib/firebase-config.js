// firebase-config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDcw6XaJLdDvppp9MQP7YRm2YqwtV7wnrA",
  authDomain: "sschedule-fad71.firebaseapp.com",
  projectId: "sschedule-fad71",
  storageBucket: "sschedule-fad71.firebasestorage.app",
  messagingSenderId: "322850097332",
  appId: "1:322850097332:web:1db6db7feecf173b5e2fe1",
  measurementId: "G-B00YXV96HN"
};

// Prevent duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
