import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About | Automated Bus Scheduler</title>
      </Head>
      <style jsx>{`
        .aboutPage {
          min-height: 100vh;
          background: linear-gradient(to right, #ede7f6, #d1c4e9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          padding: 2rem;
          position: relative;
        }

        .ticketStack {
          position: relative;
          width: 100%;
          max-width: 620px;
        }

        .ticketBase {
          background: #9575cd;
          border-radius: 20px;
          height: 240px;
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          width: 100%;
          opacity: 0.4;
        }

        .ticketBase:nth-child(1) {
          top: 40px;
        }

        .ticketBase:nth-child(2) {
          top: 20px;
        }

        .mainTicket {
          position: relative;
          background: #6a1b9a;
          color: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          z-index: 10;
        }

        .mainTicket::before,
        .mainTicket::after {
          content: "";
          position: absolute;
          width: 30px;
          height: 30px;
          background: #ede7f6;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          z-index: 0;
        }

        .mainTicket::before {
          left: -15px;
        }

        .mainTicket::after {
          right: -15px;
        }

        .mainTicket::after {
          box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.1);
        }

        .mainTicket h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .mainTicket p {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .highlight {
          color: #d1c4e9;
          font-weight: bold;
        }

        .tornEdge {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          height: 20px;
          background: repeating-linear-gradient(
            -45deg,
            #ede7f6,
            #ede7f6 10px,
            #6a1b9a 10px,
            #6a1b9a 20px
          );
          clip-path: polygon(
            0 10px,
            5px 0,
            15px 10px,
            25px 0,
            35px 10px,
            45px 0,
            55px 10px,
            65px 0,
            75px 10px,
            85px 0,
            95px 10px,
            100% 0,
            100% 20px,
            0 20px
          );
        }
      `}</style>

      <div className="aboutPage">
        <div className="ticketStack">
          <div className="ticketBase"></div>
          <div className="ticketBase"></div>
          <div className="mainTicket">
            <h2>About Our System</h2>
            <p>
              <span className="highlight">Automated Bus Scheduler</span> is an
              advanced public transport solution for efficient and reliable
              travel.
            </p>
            <p>
              Our system enables users to <span className="highlight">track buses</span>,
              plan <span className="highlight">intelligent routes</span>, and
              auto-generate <span className="highlight">optimized schedules</span>.
            </p>
            <p>
              Built by a team of passionate developers and engineers focused on
              smart mobility.
            </p>
            <div className="tornEdge"></div>
          </div>
        </div>
      </div>
    </>
  );
}
