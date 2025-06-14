import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./FeaturesSection.module.css";

const featuresData = [
  {
    title: "Bus Tracking",
    description: "Track your bus in real time and know exactly when it will arrive.",
    image: "/live-track.png",
    alt: "Live Tracking",
    clickable: false,
  },
  {
    title: "Online Ticket booking",
    description: "Book your ticket using online platform.",
    image: "/ticket.png",
    alt: "Ticket",
    clickable: true,
    route: "/ticket",
  },
  {
    title: "Bus Scheduler",
    description: "Auto-generate bus schedules tailored to demand and timing.",
    image: "/schedule.png",
    alt: "Scheduler",
    clickable: false,
  },
];

const FeaturesSection = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5500); // Show GIF for 5.5 seconds
    return () => clearTimeout(timeout);
  }, []);

  const handleCardClick = (feature) => {
    if (feature.clickable && feature.route) {
      router.push(feature.route);
    }
  };

  const handleKeyPress = (event, feature) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(feature);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <img
          src="/bus-loading.gif" 
          alt="Loading bus"
          style={{
            width: "140px",
            height: "auto",
            margin: "auto"
          }}
        />
      </div>
    );
  }

  return (
    <section className={styles.features}>
      {featuresData.map((feature, index) => (
        <div 
          key={index} 
          className={`${styles["feature-card"]} ${feature.clickable ? styles.clickable : ''}`}
          onClick={() => handleCardClick(feature)}
          onKeyDown={(e) => handleKeyPress(e, feature)}
          tabIndex={feature.clickable ? 0 : -1}
          role={feature.clickable ? "button" : undefined}
          aria-label={feature.clickable ? `Navigate to ${feature.title}` : undefined}
          style={{ 
            cursor: feature.clickable ? 'pointer' : 'default',
            transition: 'all 0.3s ease'
          }}
        >
          <img src={feature.image} alt={feature.alt} />
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default FeaturesSection;