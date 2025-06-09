// pages/find-bus.js
import Head from "next/head";

export default function FindBus() {
  return (
    <>
      <Head>
        <title>Find Bus | Automated Bus Scheduler</title>
      </Head>
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

        .inputGroup input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 1rem;
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
          background: #000000;
        }

        .illustration {
          flex: 1;
          background: #ede7f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .illustration img {
          width: 100%;
          max-width: 350px;
        }
      `}</style>

      <div className="findBusPage">
        <div className="wrapper">
          <div className="formBox">
            <h2>🚌 Find Your Bus</h2>
            <form className="searchForm">
              <div className="inputGroup">
                <label htmlFor="from">From</label>
                <input type="text" id="from" placeholder="Enter Source Location" required />
              </div>

              <div className="inputGroup">
                <label htmlFor="to">To</label>
                <input type="text" id="to" placeholder="Enter Destination" required />
              </div>

              <button type="submit">Search Buses</button>
            </form>
          </div>
          <div className="illustration">
            <img src="/bus-illustration.png" alt="Bus Illustration" />
          </div>
        </div>
      </div>
    </>
  );
}
