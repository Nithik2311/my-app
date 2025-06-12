'use client';
import { useJsApiLoader } from '@react-google-maps/api';
export function MapProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
  });
  if (loadError) return <p>Map failed to load.</p>;
  if (!isLoaded) return <p>Loading map...</p>;
  return children;
}
