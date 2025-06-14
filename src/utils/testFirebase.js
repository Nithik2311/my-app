import { db } from '../../firebase/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('DB object:', db);
    
    // Try to read from a collection (even if empty)
    const testCollection = collection(db, 'locations');
    const snapshot = await getDocs(testCollection);
    
    console.log('Firebase connection successful!');
    console.log('Documents in locations:', snapshot.size);
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
};