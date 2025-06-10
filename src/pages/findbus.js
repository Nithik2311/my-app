// pages/find-bus.js
import { useState } from "react";
import Head from "next/head";

const locations = [
  {
    name: "Central Station",
    info: "Main transit hub with 12 platforms.",
    image: "/locations/central.jpg",
  },
  {
    name: "North Terminal",
    info: "Serves intercity and airport buses.",
    image: "/locations/north.jpg",
  },
  {
    name: "Tech Park",
    info: "Popular stop for IT employees.",
    image: "/locations/tech.jpg",
  },
  {
    name: "University Gate",
    info: "Student zone near major universities.",
    image: "/locations/university.jpg",
  },
  {
    name: "Market Street",
    info: "Busy commercial shopping area.",
    image: "/locations/market.jpg",
  },
];

export default function FindBus() {
  const [hovered, setHovered] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  return (
    <>
      <Head>
        <title>Find Bus | Automated Bus Scheduler</title>
      </Head>

      <div className="findBusPage">
        <div className="wrapper">
          <div className="formBox">
            <h2>🚌 Find Your Bus</h2>
            <form className="searchForm">
              <div className="inputGroup">
                <label>From</label>
                <div
                  className="dropdownContainer"
                  onClick={() => setOpenFrom(!openFrom)}
                  onMouseLeave={() => setOpenFrom(false)}
                >
                  <div className="dropdownSelected">{from || "Select Source"}</div>
                  {openFrom && (
                    <div className="dropdownMenu">
                      {locations.map((loc) => (
                        <div
                          key={loc.name}
                          className="dropdownItem"
                          onClick={() => setFrom(loc.name)}
                          onMouseOver={() => setHovered(loc)}
                          onMouseOut={() => setHovered(null)}
                        >
                          {loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="inputGroup">
                <label>To</label>
                <div
                  className="dropdownContainer"
                  onClick={() => setOpenTo(!openTo)}
                  onMouseLeave={() => setOpenTo(false)}
                >
                  <div className="dropdownSelected">{to || "Select Destination"}</div>
                  {openTo && (
                    <div className="dropdownMenu">
                      {locations.map((loc) => (
                        <div
                          key={loc.name}
                          className="dropdownItem"
                          onClick={() => setTo(loc.name)}
                          onMouseOver={() => setHovered(loc)}
                          onMouseOut={() => setHovered(null)}
                        >
                          {loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit">Search Buses</button>
            </form>
          </div>

          <div className="illustration">
            {hovered ? (
              <div className="hoverInfo">
                <img src={hovered.image} alt={hovered.name} />
                <p>
                  <strong>{hovered.name}</strong>
                  <br />
                  {hovered.info}
                </p>
              </div>
            ) : (
              <img src="/bus-illustration.png" alt="Bus Illustration" />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .findBusPage {
          height: 100vh;
          background: linear-gradient(135deg, #ede7f6, #d1c4e9);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Poppins', sans-serif;
          padding: 2rem;
        }

        .wrapper {
          display: flex;
          flex-direction: row;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(93, 63, 211, 0.2);
          overflow: hidden;
          max-width: 900px;
          width: 100%;
        }

        .formBox {
          flex: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .formBox h2 {
          margin-bottom: 2rem;
          color: #5e35b1;
        }

        .searchForm {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .inputGroup label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #4527a0;
        }

        .dropdownContainer {
          background: #f3e5f5;
          border: 1px solid #ccc;
          border-radius: 8px;
          position: relative;
          cursor: pointer;
        }

        .dropdownSelected {
          padding: 0.8rem 1rem;
        }

        .dropdownMenu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
          animation: fadeDown 0.3s ease;
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdownItem {
          padding: 0.8rem 1rem;
          border-bottom: 1px solid #eee;
          transition: background 0.2s ease;
        }

        .dropdownItem:hover {
          background: #d1c4e9;
          color: #311B92;
          font-weight: bold;
        }

        button[type="submit"] {
          padding: 0.9rem 1.5rem;
          background: #9400D3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        button[type="submit"]:hover {
          background: #000;
        }

        .illustration {
          flex: 1;
          background: #ede7f6;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .illustration img {
          width: 100%;
          max-width: 350px;
          transition: opacity 0.3s ease;
        }

        .hoverInfo {
          text-align: center;
        }

        .hoverInfo img {
          width: 200px;
          height: auto;
          margin-bottom: 1rem;
        }

        .hoverInfo p {
          color: #311B92;
          font-size: 1rem;
        }
      `}</style>
    </>
  );
}
