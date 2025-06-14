// firebase-config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCg4eA8uZxnDR_kBd_TNbW_2UOmMYioBJM",
  authDomain: "automated-bus-scheduler.firebaseapp.com",
  projectId: "automated-bus-scheduler",
  storageBucket: "automated-bus-scheduler.appspot.com",
  messagingSenderId: "200917580915",
  appId: "1:200917580915:web:8b195513d3bdae4aeafe06"
};

// Prevent duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
