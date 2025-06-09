import Image from "next/image";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Automated Bus Scheduler</title>
        <link rel="stylesheet" href="style.css" />
      </Head>

      <header>
        <div className="container">
          <h1>Automated Bus Scheduler</h1>
          <nav>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="track">
        <div className="container">
          <h2>Simplify Your Travel</h2>
          <p>Plan, schedule, and track buses efficiently with our automated system.</p>
          <div className="buttons">
            <a href="/findbus" className="btn">Find Bus</a>
            <a href="/routes" className="btn btn-outline">Routes</a>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container bus-section">
          <h3>Our Smart Bus System</h3>
          <div className="bus-body">
            <div className="bus-window">
              <h4>Live Scheduling</h4>
              <p>Auto-generate optimal bus schedules based on passenger data.</p>
            </div>
            <div className="bus-window">
              <h4>Route Optimization</h4>
              <p>Ensure minimum delays with intelligent route suggestions.</p>
            </div>
            <div className="bus-window">
              <h4>User Dashboard</h4>
              <p>Access personalized dashboards for admins and passengers.</p>
            </div>
            <div className="bus-wheels">
              <div className="wheel"></div>
              <div className="wheel"></div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          {/* Optional footer content */}
        </div>
      </footer>
    </>
  );
}