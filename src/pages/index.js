import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <section className="track">
        <div className="container">
          <h2>Simplify Your Travel</h2>
          <p>Plan, schedule, and track buses efficiently with our automated system.</p>
          <div className="buttons">
            <a href="/findbus" className="btn">Find Bus</a>
            <a href="/assistant" className="btn btn-outline">Chat with Ai</a>
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

      <Footer />
    </>
  );
}