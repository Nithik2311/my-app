// pages/buses.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Buses() {
  const router = useRouter();
  const { source, destination } = router.query;

  const [routes, setRoutes] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample dummy data
  const dummyRoutes = [
    { source, destination, duration: '4h 30m', cost: 300, busName: 'GreenLine' },
    { source, destination, duration: '5h 10m', cost: 250, busName: 'SpeedXpress' },
    { source, destination, duration: '4h 50m', cost: 280, busName: 'SkyWays' },
  ];

  useEffect(() => {
    if (source && destination) {
      setRoutes(dummyRoutes);
    }
  }, [source, destination]);

  const handleOptimize = async () => {
    setLoading(true);
    setOptimizedRoute('');

    try {
      const response = await fetch('/api/optimizeRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routes })
      });

      const data = await response.json();

      if (data.optimizedRoute) {
        setOptimizedRoute(data.optimizedRoute);
      } else {
        setOptimizedRoute('Could not generate optimized route.');
      }
    } catch (error) {
      setOptimizedRoute('Error occurred while optimizing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Available Buses</h1>
      <h3>{source} → {destination}</h3>

      <ul>
        {routes.map((route, index) => (
          <li key={index} style={styles.routeBox}>
            <strong>{route.busName}</strong><br />
            Duration: {route.duration}<br />
            Cost: ₹{route.cost}
          </li>
        ))}
      </ul>

      <button onClick={handleOptimize} style={styles.button} disabled={loading}>
        {loading ? 'Optimizing...' : 'Optimize Routes with AI'}
      </button>

      {optimizedRoute && (
        <div style={styles.resultBox}>
          <h3>Optimized Route Suggestion:</h3>
          <pre>{optimizedRoute}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  routeBox: {
    padding: '12px',
    border: '1px solid #ccc',
    margin: '10px 0',
    borderRadius: '5px',
    backgroundColor: '#f4f4f4'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  resultBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#e1f5fe',
    borderRadius: '8px'
  }
};
