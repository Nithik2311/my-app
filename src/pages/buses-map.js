import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Routes from "../components/routes";

// Dynamically load the component without SSR
const BusMap = dynamic(() => import("../components/BusMap"), { 
  ssr: false,
  loading: () => <div style={{ 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
    fontSize: "18px",
    background: "#f5f5f5"
  }}>Loading map...</div>
});

export default function BusesMapPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [routesData, setRoutesData] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  const { sourceLat, sourceLon, destLat, destLon, source, destination } = router.query;

  // Function to generate mock bus data for a route
  const generateBusDataForRoute = (routeIndex, distance) => {
    const busTypes = [
      { prefix: "CE", name: "City Express", capacity: [45, 50, 55] },
      { prefix: "MS", name: "Metro Shuttle", capacity: [35, 40, 45] },
      { prefix: "GL", name: "Green Line", capacity: [30, 35, 40] },
      { prefix: "RL", name: "Rapid Link", capacity: [40, 45, 50] },
      { prefix: "UB", name: "Urban Bus", capacity: [25, 30, 35] }
    ];

    const numberOfBuses = Math.floor(Math.random() * 3) + 1; // 1-3 buses per route
    const buses = [];

    for (let i = 0; i < numberOfBuses; i++) {
      const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
      const busNumber = Math.floor(Math.random() * 900) + 100;
      const capacity = busType.capacity[Math.floor(Math.random() * busType.capacity.length)];
      
      // Generate realistic departure times
      const baseHour = 7 + Math.floor(Math.random() * 12); // 7 AM to 7 PM
      const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45 minutes
      const departureTime = `${baseHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Calculate arrival time based on distance (assuming 30-40 km/h average speed)
      const travelMinutes = Math.floor((distance / 35) * 60); // 35 km/h average
      const arrivalMinutes = (baseHour * 60 + minutes + travelMinutes);
      const arrivalHour = Math.floor(arrivalMinutes / 60);
      const arrivalMin = arrivalMinutes % 60;
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;

      buses.push({
        name: busType.name,
        busNumber: `${busType.prefix}-${busNumber}`,
        departure: departureTime,
        arrival: arrivalTime,
        capacity: capacity,
        image: `/bus${(i % 3) + 1}.jpg`,
        occupied: Math.floor(Math.random() * capacity * 0.7), // Random occupancy up to 70%
        fare: Math.floor(distance * 2) + Math.floor(Math.random() * 10) + 15 // Base fare calculation
      });
    }

    return buses;
  };

  // Function to handle routes received from BusMap
  const handleRoutesReceived = (mapRoutes) => {
    if (!mapRoutes || mapRoutes.length === 0) return;

    const dynamicRoutes = mapRoutes.map((route, index) => {
      const distance = Math.round(route.summary.totalDistance / 1000 * 10) / 10; // Convert to km and round
      const time = Math.round(route.summary.totalTime / 60); // Convert to minutes
      
      let routeName = `Route ${index + 1}`;
      
      // Give more descriptive names based on route characteristics
      if (index === 0) {
        routeName = distance < 15 ? "Direct Route" : "Main Route";
      } else if (distance < mapRoutes[0].summary.totalDistance / 1000) {
        routeName = "Shortcut Route";
      } else {
        routeName = "Scenic Route";
      }

      return {
        name: routeName,
        distance: distance,
        estimatedTime: time,
        routeIndex: index,
        coordinates: route.coordinates,
        buses: generateBusDataForRoute(index, distance)
      };
    });

    setRoutesData(dynamicRoutes);
  };

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  if (!isReady) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        fontSize: "18px",
        background: "#f5f5f5"
      }}>
        Preparing route...
      </div>
    );
  }

  if (!sourceLat || !destLat || !sourceLon || !destLon) {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center",
        fontSize: "18px",
        background: "#f5f5f5",
        gap: "20px"
      }}>
        <p>Invalid route parameters. Please go back and select valid locations.</p>
        <button 
          onClick={() => router.push('/findbus')}
          style={{
            padding: "10px 20px",
            background: "#9400D3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Go Back
        </button>

        
      </div>
    );
  }

  const handleRouteSelect = (index) => {
    setSelectedRouteIndex(index);
    console.log("Selected route index:", index);
  };

  const handleRouteHover = (index) => {
    // This will be used to highlight the route on the map
    console.log("Hovering over route:", index);
  };

  return (
    <>
      <Head>
        <title>Bus Route | {source} to {destination}</title>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <style jsx global>{`
          .leaflet-default-icon-path {
            background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png');
          }
          .leaflet-container {
            height: 100vh;
            width: 100%;
          }
          .leaflet-popup-content {
            margin: 10px;
          }
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                        Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 
                        sans-serif;
          }
          * {
            box-sizing: border-box;
          }
          @media (max-width: 768px) {
            .leaflet-container {
              height: calc(100vh - 60px);
            }
            .routesPage {
              flex-direction: column;
            }
          }
          @media (max-width: 480px) {
            .busContainer {
              width: 95%;
            }
            .carouselBox {
              width: 95%;
            }
          }
        `}</style>
      </Head>

      <div style={{ position: "relative", height: "100vh" }}>
        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 15px rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(0,0,0,0.1)"
        }}>
          <div>
            <h3 style={{ 
              margin: 0, 
              color: "#5e35b1",
              fontSize: "1.2rem",
              fontWeight: "600"
            }}>
              Route: {source} → {destination}
            </h3>
            <p style={{
              margin: "5px 0 0",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              {routesData.length > 0 ? `${routesData.length} routes found` : "Finding routes..."}
            </p>
          </div>
          <button 
            onClick={() => router.push('/findbus')}
            style={{
              padding: "8px 16px",
              background: "#9400D3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8a00c7";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#9400D3";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            New Search
          </button>
        </div>

        <BusMap
          sourceLat={parseFloat(sourceLat)}
          sourceLon={parseFloat(sourceLon)}
          destLat={parseFloat(destLat)}
          destLon={parseFloat(destLon)}
          onRoutesFound={handleRoutesReceived}
          selectedRouteIndex={selectedRouteIndex}
        />
        
        <div style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          maxWidth: "90%",
          width: "auto"
        }}>
          <Routes 
            routesData={routesData}
            onRouteSelect={handleRouteSelect}
            onRouteHover={handleRouteHover}
            selectedRouteIndex={selectedRouteIndex}
          />
        </div>

        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          zIndex: 500,
          background: "rgba(255,255,255,0.7)",
          padding: "2px 5px",
          borderRadius: "3px",
          fontSize: "10px"
        }}>
          © OpenStreetMap contributors
        </div>
      </div>
    </>
  );
}