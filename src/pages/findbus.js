import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// Sample locations array
const locations = [
  { name: "Koyambedu", image: "/koyambedu.png", info: "Major bus terminus" },
  { name: "Chennai Central", image: "/central.png", info: "Central railway station" },
  { name: "Tambaram", image: "/tambaram.png", info: "Bus and train junction" },
  { name: "Guindy", image: "/guindy.png", info: "Industrial area" },
  { name: "Anna Nagar", image: "/annanagar.png", info: "Residential area" },
  { name: "T Nagar", image: "/tnagar.png", info: "Shopping district" },
  { name: "Adyar", image: "/adyar.png", info: "Coastal neighborhood" },
  { name: "Marina Beach", image: "/marina.png", info: "Famous beach" },
  { name: "Perambur", image: "/perambur.png", info: "Suburban locality" },
  { name: "Chengalpattu", image: "/chengalpattu.png", info: "Outskirts city" }
];

// Function to get coordinates from OpenStreetMap
async function getCoordinates(place) { 
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}, Chennai, Tamil Nadu, India&limit=1`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('No coordinates found for this location');
    }
    
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
}

export default function FindBus() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!from || !to) {
      alert("Please select both source and destination.");
      return;
    }
    
    if (from === to) {
      alert("Source and destination cannot be the same.");
      return;
    }

    setLoading(true);
    
    try {
      const [sourceCoord, destCoord] = await Promise.all([
        getCoordinates(from),
        getCoordinates(to)
      ]);

      router.push({
        pathname: "/buses-map",
        query: {
          sourceLat: sourceCoord.lat,
          sourceLon: sourceCoord.lon,
          destLat: destCoord.lat,
          destLon: destCoord.lon,
          source: from,
          destination: to
        }
      });
    } catch (err) {
      console.error("Failed to fetch coordinates", err);
      alert("Could not fetch route coordinates. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (locationName, isSource = true) => {
    if (isSource) {
      setFrom(locationName);
      setOpenFrom(false);
    } else {
      setTo(locationName);
      setOpenTo(false);
    }
  };

  return (
    <>
      <Head>
        <title>Find Bus | Automated Bus Scheduler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="findBusPage">
        <div className="wrapper">
          <div className="formBox">
            <h2>🚌 Find Your Bus</h2>
            <form className="searchForm" onSubmit={handleSubmit}>
              <div className="inputGroup">
                <label>From</label>
                <div
                  className="dropdownContainer"
                  onClick={() => {
                    setOpenFrom(!openFrom);
                    setOpenTo(false);
                  }}
                >
                  <div className="dropdownSelected">
                    {from || "Select Source"}
                    <span className="dropdownArrow">▼</span>
                  </div>
                  {openFrom && (
                    <div className="dropdownMenu">
                      {locations.map((loc) => (
                        <div
                          key={`from-${loc.name}`}
                          className={`dropdownItem ${to === loc.name ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (to !== loc.name) {
                              handleLocationSelect(loc.name, true);
                            }
                          }}
                          onMouseOver={() => setHovered(loc)}
                          onMouseOut={() => setHovered(null)}
                        >
                          {loc.name}
                          {to === loc.name && <span className="disabledText"> (Selected as destination)</span>}
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
                  onClick={() => {
                    setOpenTo(!openTo);
                    setOpenFrom(false);
                  }}
                >
                  <div className="dropdownSelected">
                    {to || "Select Destination"}
                    <span className="dropdownArrow">▼</span>
                  </div>
                  {openTo && (
                    <div className="dropdownMenu">
                      {locations.map((loc) => (
                        <div
                          key={`to-${loc.name}`}
                          className={`dropdownItem ${from === loc.name ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (from !== loc.name) {
                              handleLocationSelect(loc.name, false);
                            }
                          }}
                          onMouseOver={() => setHovered(loc)}
                          onMouseOut={() => setHovered(null)}
                        >
                          {loc.name}
                          {from === loc.name && <span className="disabledText"> (Selected as source)</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Finding Route..." : "Search Buses"}
              </button>
            </form>
          </div>

          <div className="illustration">
            {hovered ? (
              <div className="hoverInfo">
                <img 
                  src={hovered.image} 
                  alt={hovered.name}
                  onError={(e) => {
                    e.target.src = "/bus-illustration.png";
                  }}
                />
                <p>
                  <strong>{hovered.name}</strong>
                  <br />
                  {hovered.info}
                </p>
              </div>
            ) : (
              <img 
                src="/bus-illustration.png" 
                alt="Bus Illustration"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(openFrom || openTo) && (
        <div 
          className="overlay" 
          onClick={() => {
            setOpenFrom(false);
            setOpenTo(false);
          }}
        />
      )}

      {/* CSS Styling */}
      <style jsx>{`
        .findBusPage {
          min-height: 100vh;
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
          font-size: 2rem;
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
          transition: border-color 0.2s ease;
        }

        .dropdownContainer:hover {
          border-color: #9400D3;
        }

        .dropdownSelected {
          padding: 0.8rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdownArrow {
          font-size: 0.8rem;
          color: #666;
          transition: transform 0.2s ease;
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
          cursor: pointer;
        }

        .dropdownItem:last-child {
          border-bottom: none;
        }

        .dropdownItem:hover:not(.disabled) {
          background: #d1c4e9;
          color: #311B92;
          font-weight: bold;
        }

        .dropdownItem.disabled {
          color: #ccc;
          cursor: not-allowed;
          background: #f9f9f9;
        }

        .disabledText {
          font-size: 0.8rem;
          font-style: italic;
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
          font-weight: 500;
        }

        button[type="submit"]:hover:not(:disabled) {
          background: #7B1FA2;
        }

        button[type="submit"]:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .illustration {
          flex: 1;
          background: #ede7f6;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
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
          border-radius: 8px;
        }

        .hoverInfo p {
          color: #311B92;
          font-size: 1rem;
          line-height: 1.5;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 5;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .wrapper {
            flex-direction: column;
          }
          
          .formBox {
            padding: 2rem;
          }
          
          .illustration {
            min-height: 200px;
          }
          
          .findBusPage {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}