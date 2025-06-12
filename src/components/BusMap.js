import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

export default function BusMap({ 
  sourceLat, 
  sourceLon, 
  destLat, 
  destLon, 
  onRoutesFound, 
  selectedRouteIndex 
}) {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const containerRef = useRef(null);
  const [routes, setRoutes] = useState([]);
  const routeLayersRef = useRef([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!sourceLat || !destLat) return;

    // Clean up existing map if it exists
    if (mapRef.current) {
      clearRoutes();
      clearMarkers();
      if (routingControlRef.current) {
        try {
          routingControlRef.current.off();
          mapRef.current.removeControl(routingControlRef.current);
        } catch (e) {
          console.warn("Error removing routing control:", e);
        }
        routingControlRef.current = null;
      }
      mapRef.current.remove();
      mapRef.current = null;
    }

    const mapContainer = containerRef.current;
    if (!mapContainer) return;

    if (mapContainer._leaflet_id) {
      delete mapContainer._leaflet_id;
    }

    mapContainer.innerHTML = '';

    try {
      const map = L.map(mapContainer).setView([sourceLat, sourceLon], 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      setTimeout(() => {
        if (map && map.invalidateSize) {
          map.invalidateSize();
        }
      }, 100);

      // Custom markers
      const startIcon = L.divIcon({
        html: '<div style="background: #4CAF50; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const endIcon = L.divIcon({
        html: '<div style="background: #f44336; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const startMarker = L.marker([sourceLat, sourceLon], { icon: startIcon })
        .bindPopup("<b>Start Location</b><br>Departure Point")
        .addTo(map);
      
      const endMarker = L.marker([destLat, destLon], { icon: endIcon })
        .bindPopup("<b>Destination</b><br>Arrival Point")
        .addTo(map);

      markersRef.current = [startMarker, endMarker];

      // Create routing control with multiple route options
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(sourceLat, sourceLon),
          L.latLng(destLat, destLon),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null, // We're using custom markers
        lineOptions: {
          styles: [{ color: 'transparent', weight: 0 }] // Hide default route line
        },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
          useHints: false
        }),
        show: false, // Hide the routing instructions panel
        fitSelectedRoutes: false,
        plan: L.Routing.plan([
          L.latLng(sourceLat, sourceLon),
          L.latLng(destLat, destLon)
        ], {
          createMarker: () => null,
          routeWhileDragging: false
        })
      });

      routingControl.on('routingerror', function(e) {
        console.warn('Routing error:', e);
      });

      routingControl.on('routesfound', function(e) {
        const foundRoutes = e.routes;
        setRoutes(foundRoutes);
        
        // Clear existing route layers
        clearRoutes();
        
        // Display all routes with different colors
        displayAllRoutes(foundRoutes, map);
        
        // Notify parent component about routes
        if (onRoutesFound) {
          onRoutesFound(foundRoutes);
        }
        
        // Fit map to show all routes
        if (foundRoutes.length > 0) {
          const allCoordinates = foundRoutes.reduce((acc, route) => {
            return acc.concat(route.coordinates);
          }, []);
          const bounds = L.latLngBounds(allCoordinates);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      });

      routingControl.addTo(map);
      routingControlRef.current = routingControl;

      // Initial map bounds
      const group = new L.featureGroup([startMarker, endMarker]);
      map.fitBounds(group.getBounds().pad(0.1));

    } catch (error) {
      console.error("Error creating map:", error);
    }

    return () => {
      clearRoutes();
      clearMarkers();
      if (routingControlRef.current) {
        try {
          routingControlRef.current.off();
          if (mapRef.current) {
            mapRef.current.removeControl(routingControlRef.current);
          }
        } catch (e) {
          console.warn("Error during routing control cleanup:", e);
        }
        routingControlRef.current = null;
      }
      
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn("Error during map cleanup:", e);
        }
        mapRef.current = null;
      }
    };
  }, [sourceLat, sourceLon, destLat, destLon]);

  // Effect to handle route selection highlighting
  useEffect(() => {
    if (selectedRouteIndex !== null && routes.length > 0) {
      highlightSelectedRoute(selectedRouteIndex);
    }
  }, [selectedRouteIndex, routes]);

  const clearRoutes = () => {
    routeLayersRef.current.forEach(layer => {
      if (mapRef.current && layer) {
        mapRef.current.removeLayer(layer);
      }
    });
    routeLayersRef.current = [];
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      if (mapRef.current && marker) {
        mapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  };

  const displayAllRoutes = (routes, map) => {
    const colors = ['#6FA1EC', '#FF6B6B', '#4ECDC4', '#FFBE0B', '#8338EC'];
    
    routes.forEach((route, index) => {
      const color = colors[index % colors.length];
      const weight = index === 0 ? 6 : 4; // Main route is thicker
      const opacity = index === 0 ? 0.8 : 0.6;
      
      const routeLayer = L.polyline(route.coordinates, {
        color,
        weight,
        opacity,
        dashArray: index === 0 ? null : '8, 5' // Alternative routes are dashed
      }).addTo(map);
      
      // Add popup with route info
      const distance = Math.round(route.summary.totalDistance / 1000 * 10) / 10;
      const time = Math.round(route.summary.totalTime / 60);
      
      routeLayer.bindPopup(
        `<b>Route ${index + 1}</b><br>
         Distance: ${distance} km<br>
         Est. Time: ${time} min`
      );
      
      routeLayersRef.current.push(routeLayer);
    });
  };

  const highlightSelectedRoute = (routeIndex) => {
    if (!routes[routeIndex] || !mapRef.current) return;

    clearRoutes();
    
    const selectedRoute = routes[routeIndex];
    const colors = ['#6FA1EC', '#FF6B6B', '#4ECDC4', '#FFBE0B', '#8338EC'];
    
    // Display all routes but highlight the selected one
    routes.forEach((route, index) => {
      const isSelected = index === routeIndex;
      const color = colors[index % colors.length];
      const weight = isSelected ? 8 : 3;
      const opacity = isSelected ? 1 : 0.4;
      const zIndex = isSelected ? 1000 : 500;
      
      const routeLayer = L.polyline(route.coordinates, {
        color,
        weight,
        opacity,
        dashArray: isSelected ? null : (index === 0 ? null : '8, 5'),
        interactive: true,
        pane: 'overlayPane'
      }).addTo(mapRef.current);
      
      // Add pulse effect to selected route
      if (isSelected) {
        routeLayer.setStyle({
          className: 'selected-route-pulse'
        });
      }
      
      const distance = Math.round(route.summary.totalDistance / 1000 * 10) / 10;
      const time = Math.round(route.summary.totalTime / 60);
      
      routeLayer.bindPopup(
        `<b>Route ${index + 1} ${isSelected ? '(Selected)' : ''}</b><br>
         Distance: ${distance} km<br>
         Est. Time: ${time} min`
      );
      
      routeLayersRef.current.push(routeLayer);
    });

    // Fit map to selected route
    const bounds = L.latLngBounds(selectedRoute.coordinates);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <>
      <div 
        ref={containerRef}
        style={{ 
          height: "100vh", 
          width: "100%",
          background: "#f0f0f0",
          position: "relative"
        }}
      />
      
      {/* Add CSS for pulse animation */}
      <style jsx>{`
        :global(.selected-route-pulse) {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            stroke-width: 8;
            stroke-opacity: 1;
          }
          50% {
            stroke-width: 12;
            stroke-opacity: 0.7;
          }
          100% {
            stroke-width: 8;
            stroke-opacity: 1;
          }
        }
      `}</style>
    </>
  );
}