// pages/routes.js
import Head from "next/head";
import { useState } from "react";

export default function Routes() {
  const [selectedRoute, setSelectedRoute] = useState(null);

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

  return (
    <>
      <Head>
        <title>Bus Routes | Automated Bus Scheduler</title>
      </Head>
      <style jsx>{`
        .routesPage {
          height: 100vh;
          background: linear-gradient(to right, #ede7f6, #d1c4e9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
        }

        .busContainer {
          width: 400px;
          background: #6a1b9a;
          border-radius: 20px 20px 5px 5px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          position: relative;
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
          content: '';
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
          color: #fff;
        }

        .busWindow {
          height: 340px;
          background: #fff;
          color: #333;
          overflow-y: auto;
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
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

        .routeItem span {
          margin-right: 0.6rem;
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
      `}</style>

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
                onClick={() => setSelectedRoute(index)}
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
      </div>
    </>
  );
}
