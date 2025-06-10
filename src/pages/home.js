import Head from "next/head";
import Link from "next/link";
import React,{ useEffect, useState } from "react";
import FeaturesSection from "@/components/FeaturesSection";


export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Automated Bus Scheduler</title>
      </Head>

      <main className="home-container">
        <header className="hero">
          <h1>Smarter Travel Starts Here</h1>
          <p>Plan routes, view live locations, and never miss your bus again.</p>
          <div className="hero-buttons">
            <Link href="/login" className="btn-primary">Login</Link>
            <Link href="/signup" className="btn-secondary">Sign Up</Link>
          </div>
        </header>

        <section className="features">
          <FeaturesSection />
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <ol>
            <li><strong>Plan:</strong> Enter your route details</li>
            <li><strong>Track:</strong> Get live bus locations</li>
            <li><strong>Ride:</strong> Reach your destination smoothly</li>
          </ol>
        </section>

        <footer className="footer">
          <p>&copy; 2025 Bus Scheduler. All rights reserved.</p>
          <Link href="/contact">Contact</Link>
        </footer>

        <style jsx>{`
          .home-container {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(to bottom, #f3e8ff, #fff);
            color: #1e1e2f;
            padding: 2rem;
          }

          .hero {
            text-align: center;
            padding: 3rem 1rem;
            background: #9400D3;
            color: #fff;
            border-radius: 1rem;
            margin-bottom: 3rem;
          }

          .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }

          .hero p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .hero-buttons a {
            margin: 0 1rem;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 8px;
            text-decoration: none;
          }

          .btn-primary {
            background: #facc15;
            color: #1e1e1e;
          }

          .btn-secondary {
            border: 2px solid #fff;
            color: #fff;
          }

          .features {
            display: flex;
            gap: 2rem;
            justify-content: space-around;
            flex-wrap: wrap;
            padding: 2rem 0;
          }

          .feature-card {
            background: #fff;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            width: 280px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .feature-card img {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
          }

          .feature-card h3 {
            font-size: 1.25rem;
            color: #311B92;
            margin-bottom: 0.5rem;
          }

          .feature-card p {
            font-size: 0.95rem;
            color: #444;
          }

          .feature-card.clickable {
            cursor: pointer;
            background: linear-gradient(to top left, #f3e8ff, #fff);
            border: 2px solid transparent;
          }

          .feature-card.clickable:hover {
            transform: translateY(-6px);
            box-shadow: 0 10px 30px rgba(93, 63, 211, 0.25);
            border-color: #5D3FD3;
          }

          .feature-card.clickable:focus-within {
            outline: 2px solid #5D3FD3;
          }

          .bus-loader {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            position: relative;
            overflow: hidden;
          }

          .bus-icon {
            width: 80px;
            animation: busDrive 2s linear infinite;
          }

          @keyframes busDrive {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100vw);
            }
          }

          .how-it-works {
            background: #e9d5ff;
            padding: 2rem;
            border-radius: 1rem;
            margin-top: 3rem;
            text-align: center;
          }

          .how-it-works ol {
            list-style: decimal;
            text-align: left;
            max-width: 600px;
            margin: auto;
            padding-left: 1rem;
          }

          .footer {
            margin-top: 3rem;
            text-align: center;
            font-size: 0.9rem;
            color: #555;
          }

          .footer a {
            color: #5D3FD3;
            margin-left: 1rem;
            text-decoration: none;
          }
        `}</style>
      </main>
    </>
  );
}
