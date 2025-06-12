import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

export default function LeafletMap() {
  useEffect(() => {
  const map = L.map("map").setView([12.9716, 77.5946], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const routingControl = L.Routing.control({
    waypoints: [
      L.latLng(12.9716, 77.5946), // Bangalore
      L.latLng(12.2958, 76.6394), // Mysore
    ],
    routeWhileDragging: false,
  }).addTo(map);

  return () => {
    if (map && map.remove) {
      map.remove(); // This line now safely checks before removing
    }
  };
}, []);


  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}
