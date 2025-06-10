import Head from "next/head";
import routeBusData from "@/components/routeBusData";
import { useState, useEffect } from "react";


export default function Routes() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const routes = [
    "Route 1: Central Park → City Station",
    "Route 2: North Avenue → Tech Park",
    "Route 3: Airport → University Gate",
    "Route 4: Downtown → East End",
    "Route 5: River View → Garden City",
    "Route 6: Hill Top → Mall Road",
    "Route 7: Green Valley → Industrial Area",
    "Route 8: Stadium → Museum Circle",
    "Route 9: Bus Depot → Marina Drive",
    "Route 10: Metro Hub → Old Town",
  ];

  const buses = selectedRoute !== null ? routeBusData[selectedRoute] || [] : [];

  // Auto-carousel effect
  useEffect(() => {
  if (selectedRoute === null || buses.length === 0) return;

  const interval = setInterval(() => {
    setCarouselIndex((prev) => (prev + 1) % buses.length);
  }, 2500);

  return () => clearInterval(interval);
}, [selectedRoute, buses]);

  return (
    <>
      <Head>
        <title>Bus Routes | Automated Bus Scheduler</title>
      </Head>

      <div className="routesPage">
        <div className="busContainer">
          <div className="busTop">
            <div className="busLogo">🚌 Routes</div>
          </div>
          <div className="busWindow">
            {routes.map((route, index) => (
              <div
                key={index}
                className={`routeItem ${
                  selectedRoute === index ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedRoute(index);
                  setCarouselIndex(0); // Reset carousel
                }}
              >
                <span>🛣️</span>
                {route}
              </div>
            ))}
          </div>
          <div className="wheels">
            <div className="wheel"></div>
            <div className="wheel"></div>
          </div>
        </div>

        {/* 🚍 Carousel Section */}
        {selectedRoute !== null && (
          <div className="carouselBox">
            {buses.length > 0 ? (
              <>
                <img
                  src={buses[carouselIndex].image}
                  alt={buses[carouselIndex].name}
                  className="carouselImage"
                />
                <h3>{buses[carouselIndex].name}</h3>
                <p><strong>Bus No:</strong> {buses[carouselIndex].busNumber}</p>
                <p><strong>Departure:</strong> {buses[carouselIndex].departure}</p>
                <p><strong>Arrival:</strong> {buses[carouselIndex].arrival}</p>
                <p><strong>Capacity:</strong> {buses[carouselIndex].capacity} passengers</p>
              </>

            ) : (
              <p>No buses available for this route.</p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .routesPage {
          display: flex;
          height: 100vh;
          background: linear-gradient(to right, #ede7f6, #d1c4e9);
          font-family: "Poppins", sans-serif;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 2rem;
        }

        .busContainer {
          width: 400px;
          background: #6a1b9a;
          border-radius: 20px 20px 5px 5px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          padding: 1.2rem;
          color: white;
          min-height: 520px;
        }

        .busTop {
          background: #9575cd;
          height: 90px;
          border-radius: 15px 15px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .busTop::before,
        .busTop::after {
          content: "";
          position: absolute;
          width: 40px;
          height: 40px;
          background: #d1c4e9;
          top: 25px;
          border-radius: 50%;
        }

        .busTop::before {
          left: 10px;
        }

        .busTop::after {
          right: 10px;
        }

        .busLogo {
          font-size: 1.6rem;
          font-weight: bold;
        }

        .busWindow {
          background: #fff;
          color: #333;
          overflow-y: auto;
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
          height: 340px;
        }

        .routeItem {
          padding: 0.7rem;
          border-bottom: 1px solid #ddd;
          font-size: 1rem;
          display: flex;
          align-items: center;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .routeItem:hover {
          background-color: #f3e5f5;
        }

        .routeItem.selected {
          background-color: #d1c4e9;
          color: #4a148c;
          font-weight: bold;
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
        }

        .carouselBox {
          flex: 1;
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          min-width: 350px;
        }

        .carouselImage {
            width: 320px;
            height: 200px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            object-fit: cover;
            margin: 0 auto;
            display: block;
          }


        .carouselBox h3 {
          margin-top: 1rem;
          color: #6a1b9a;
        }
      `}</style>
    </>
  );
}
