// firebase-config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAx_BXnKxO4G2UWBPk02wYEUXn2sKNsqZg",
  authDomain: "automatedbus-1ec2c.firebaseapp.com",
  projectId: "automatedbus-1ec2c",
  storageBucket: "automatedbus-1ec2c.firebasestorage.app",
  messagingSenderId: "940424838307",
  appId: "1:940424838307:web:817f4c1913a88634dc1316",
  measurementId: "G-JX6SRLG8KZ"
};

// Prevent duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
