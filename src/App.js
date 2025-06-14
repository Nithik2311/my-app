import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase'; // Adjust path as needed
import DataPopulationComponent from './components/DataPopulationComponent';
import { testFirebaseConnection } from './utils/testFirebase';

function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  useEffect(() => {
    const checkFirebase = async () => {
      console.log('=== APP.JS FIREBASE CHECK ===');
      console.log('DB imported:', db);
      console.log('DB type:', typeof db);
      
      if (!db) {
        setFirebaseError('Database not imported correctly');
        return;
      }

      const isConnected = await testFirebaseConnection();
      if (isConnected) {
        setFirebaseReady(true);
      } else {
        setFirebaseError('Firebase connection test failed');
      }
    };

    checkFirebase();
  }, []);

  if (firebaseError) {
    return (
      <div style={{ padding: '20px', background: '#fee', border: '1px solid #f88' }}>
        <h2>Firebase Error</h2>
        <p>{firebaseError}</p>
        <p>Check the console for more details.</p>
      </div>
    );
  }

  if (!firebaseReady) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Loading Firebase...</h2>
        <p>Testing Firebase connection...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Bus Booking System</h1>
      <div style={{ padding: '10px', background: '#efe', border: '1px solid #8f8' }}>
        ✅ Firebase Connected Successfully
      </div>
      
      {/* Pass db as prop */}
      <DataPopulationComponent db={db} />
    </div>
  );
}

export default App;