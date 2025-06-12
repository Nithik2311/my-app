import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Routes({ 
  routesData, 
  onRouteSelect, 
  onRouteHover, 
  selectedRouteIndex 
}) {
  const [hoveredRoute, setHoveredRoute] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [busNumbers, setBusNumbers] = useState({});

  const buses = hoveredRoute !== null ? routesData[hoveredRoute]?.buses || [] : 
                (selectedRouteIndex !== null ? routesData[selectedRouteIndex]?.buses || [] : []);

  // Generate random bus numbers and assign random images
  const generateBusData = (buses) => {
    return buses.map((bus, index) => {
      const busKey = `${hoveredRoute || selectedRouteIndex}-${index}`;
      if (!busNumbers[busKey]) {
        const randomBusNumber = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
        const randomImageNumber = Math.floor(Math.random() * 20) + 1; // 1-20 for bus1.jpg to bus20.jpg
        setBusNumbers(prev => ({
          ...prev,
          [busKey]: {
            number: randomBusNumber,
            image: randomImageNumber
          }
        }));
      }
      return {
        ...bus,
        displayNumber: busNumbers[busKey]?.number || Math.floor(Math.random() * 9000) + 1000,
        imageNumber: busNumbers[busKey]?.image || Math.floor(Math.random() * 20) + 1
      };
    });
  };

  const enhancedBuses = generateBusData(buses);

  useEffect(() => {
    if ((hoveredRoute === null && selectedRouteIndex === null) || enhancedBuses.length === 0) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % enhancedBuses.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hoveredRoute, selectedRouteIndex, enhancedBuses]);

  const handleRouteClick = (index) => {
    if (onRouteSelect) {
      onRouteSelect(index);
    }
    setCarouselIndex(0);
  };

  const handleRouteMouseEnter = (index) => {
    setHoveredRoute(index);
    setCarouselIndex(0);
    if (onRouteHover) {
      onRouteHover(index);
    }
  };

  const handleRouteMouseLeave = () => {
    setHoveredRoute(null);
    setCarouselIndex(0);
  };

  if (!routesData || routesData.length === 0) {
    return (
      <div className="routesPage">
        <div className="busContainer" style={{ opacity: 0.9 }}>
          <div className="busTop">
            <div className="busLogo">🚌 Finding Routes...</div>
          </div>
          <div className="busWindow">
            <div className="loadingMessage">
              <div className="spinner"></div>
              <p>Searching for available routes and buses...</p>
            </div>
          </div>
          <div className="wheels">
            <div className="wheel spinning"></div>
            <div className="wheel spinning"></div>
          </div>
        </div>
        
        <style jsx>{`
          .routesPage {
            display: flex;
            background: rgba(237, 231, 246, 0.7);
            font-family: "Poppins", sans-serif;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            gap: 2rem;
            backdrop-filter: blur(5px);
          }

          .busContainer {
            width: 400px;
            background: rgba(106, 27, 154, 0.9);
            border-radius: 20px 20px 5px 5px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
            padding: 1.2rem;
            color: white;
            min-height: 520px;
            transition: opacity 0.3s;
          }

          .busTop {
            background: rgba(149, 117, 205, 0.9);
            height: 90px;
            border-radius: 15px 15px 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .busLogo {
            font-size: 1.6rem;
            font-weight: bold;
          }

          .busWindow {
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 2rem;
            border-radius: 10px;
            margin-top: 1rem;
            height: 340px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loadingMessage {
            text-align: center;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #9400D3;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .wheels {
            display: flex;
            justify-content: space-between;
            margin-top: 1.2rem;
          }

          .wheel {
            width: 34px;
            height: 34px;
            background: #311b92;
            border-radius: 50%;
            box-shadow: inset -3px -3px 5px rgba(0,0,0,0.2);
          }

          .wheel.spinning {
            animation: spin 2s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Bus Routes | Automated Bus Scheduler</title>
      </Head>

      <div className="routesPage">
        <div className="busContainer" style={{ opacity: 0.9 }}>
          <div className="busTop">
            <div className="busLogo">🚌 Available Routes</div>
          </div>
          <div className="busWindow">
            {routesData.map((route, index) => (
              <div
                key={index}
                className={`routeItem ${
                  selectedRouteIndex === index ? "selected" : ""
                } ${hoveredRoute === index ? "hovered" : ""}`}
                onClick={() => handleRouteClick(index)}
                onMouseEnter={() => handleRouteMouseEnter(index)}
                onMouseLeave={handleRouteMouseLeave}
              >
                <div className="routeIcon">
                  {index === 0 ? "🛣️" : index === 1 ? "🌿" : "🏙️"}
                </div>
                <div className="routeDetails">
                  <div className="routeName">{route.name}</div>
                  <div className="routeDescription">{route.description}</div>
                  <div className="routeStats">
                    <span className="busCount">🚌 {route.buses?.length || 0} buses</span>
                    <span className="routeDistance">📍 {route.distance || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="wheels">
            <div className="wheel"></div>
            <div className="wheel"></div>
          </div>
        </div>

        {buses.length > 0 && (
          <div className="busDetailsContainer">
            <div className="busDetailsHeader">
              <h3>🚌 Bus Details</h3>
              <div className="carouselIndicators">
                {enhancedBuses.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${carouselIndex === index ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(index)}
                  />
                ))}
              </div>
            </div>
            <div className="busCard">
              <div className="busImageContainer">
                <Image
                  src={`/buses/bus${enhancedBuses[carouselIndex]?.imageNumber || 1}.jpg`}
                  alt={`Bus ${enhancedBuses[carouselIndex]?.displayNumber}`}
                  width={400}
                  height={200}
                  className="busImage"
                  priority
                  onError={(e) => {
                    e.target.src = `/buses/bus1.jpg`; // Fallback image
                  }}
                />
                <div className="busImageOverlay">
                  <span className="busNumberOverlay">#{enhancedBuses[carouselIndex]?.displayNumber}</span>
                </div>
              </div>
              <div className="busInfo">
                <div className="busNumber">Bus #{enhancedBuses[carouselIndex]?.displayNumber || 'N/A'}</div>
                <div className="busRoute">{enhancedBuses[carouselIndex]?.route || 'Unknown Route'}</div>
                <div className="busCapacity">
                  <span className="capacityIcon">👥</span>
                  <span>Capacity: {enhancedBuses[carouselIndex]?.capacity || 'N/A'}</span>
                </div>
                <div className="busStatus">
                  <span className={`statusIndicator ${enhancedBuses[carouselIndex]?.status?.toLowerCase() || 'unknown'}`}></span>
                  <span>Status: {enhancedBuses[carouselIndex]?.status || 'Unknown'}</span>
                </div>
              </div>
              <div className="busSchedule">
                <h4>⏰ Schedule</h4>
                <div className="scheduleList">
                  {enhancedBuses[carouselIndex]?.schedule?.map((time, idx) => (
                    <div key={idx} className="scheduleTime">{time}</div>
                  )) || <div className="noSchedule">No schedule available</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .routesPage {
            display: flex;
            background: rgba(237, 231, 246, 0.7);
            font-family: "Poppins", sans-serif;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            gap: 2rem;
            backdrop-filter: blur(5px);
            min-height: 100vh;
          }

          .busContainer {
            width: 400px;
            background: rgba(106, 27, 154, 0.9);
            border-radius: 20px 20px 5px 5px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
            padding: 1.2rem;
            color: white;
            min-height: 520px;
            transition: all 0.3s ease;
          }

          .busTop {
            background: rgba(149, 117, 205, 0.9);
            height: 90px;
            border-radius: 15px 15px 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .busLogo {
            font-size: 1.6rem;
            font-weight: bold;
          }

          .busWindow {
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 1.5rem;
            border-radius: 10px;
            margin-top: 1rem;
            height: 340px;
            overflow-y: auto;
          }

          .routeItem {
            display: flex;
            align-items: center;
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }

          .routeItem:hover, .routeItem.hovered {
            background: rgba(148, 0, 211, 0.1);
            border-color: #9400D3;
            transform: translateX(5px);
          }

          .routeItem.selected {
            background: rgba(148, 0, 211, 0.2);
            border-color: #9400D3;
            box-shadow: 0 2px 8px rgba(148, 0, 211, 0.3);
          }

          .routeIcon {
            font-size: 2rem;
            margin-right: 1rem;
          }

          .routeDetails {
            flex: 1;
          }

          .routeName {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.3rem;
          }

          .routeDescription {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.5rem;
          }

          .routeStats {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;
            color: #888;
          }

          .busCount, .routeDistance {
            display: flex;
            align-items: center;
            gap: 0.3rem;
          }

          .wheels {
            display: flex;
            justify-content: space-between;
            margin-top: 1.2rem;
          }

          .wheel {
            width: 34px;
            height: 34px;
            background: #311b92;
            border-radius: 50%;
            box-shadow: inset -3px -3px 5px rgba(0,0,0,0.2);
          }

          .busDetailsContainer {
            width: 450px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            color: #333;
            min-height: 520px;
          }

          .busImageContainer {
            position: relative;
            width: 100%;
            height: 200px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .busImage {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .busImage:hover {
            transform: scale(1.05);
          }

          .busImageOverlay {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(148, 0, 211, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9rem;
            backdrop-filter: blur(5px);
          }

          .busNumberOverlay {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .busDetailsHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #eee;
          }

          .busDetailsHeader h3 {
            margin: 0;
            color: #9400D3;
            font-size: 1.3rem;
          }

          .carouselIndicators {
            display: flex;
            gap: 0.5rem;
          }

          .indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ddd;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .indicator.active {
            background: #9400D3;
            transform: scale(1.2);
          }

          .busCard {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid #e0e8ff;
          }

          .busInfo {
            margin-bottom: 1.5rem;
          }

          .busNumber {
            font-size: 1.4rem;
            font-weight: bold;
            color: #9400D3;
            margin-bottom: 0.5rem;
          }

          .busRoute {
            font-size: 1rem;
            color: #666;
            margin-bottom: 1rem;
          }

          .busCapacity, .busStatus {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.8rem;
            font-size: 0.9rem;
          }

          .capacityIcon {
            font-size: 1.1rem;
          }

          .statusIndicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
          }

          .statusIndicator.active {
            background: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
          }

          .statusIndicator.inactive {
            background: #f44336;
          }

          .statusIndicator.maintenance {
            background: #ff9800;
          }

          .statusIndicator.unknown {
            background: #9e9e9e;
          }

          .busSchedule h4 {
            color: #9400D3;
            margin-bottom: 1rem;
            font-size: 1.1rem;
          }

          .scheduleList {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 0.5rem;
          }

          .scheduleTime {
            background: white;
            padding: 0.5rem;
            border-radius: 6px;
            text-align: center;
            font-size: 0.85rem;
            font-weight: 500;
            border: 1px solid #e0e8ff;
            color: #666;
          }

          .noSchedule {
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 1rem;
          }

          .loadingMessage {
            text-align: center;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #9400D3;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .routesPage {
              flex-direction: column;
              padding: 1rem;
            }

            .busContainer, .busDetailsContainer {
              width: 100%;
              max-width: 400px;
            }

            .scheduleList {
              grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            }
          }
        `}</style>
      </div>
    </>
  );
}