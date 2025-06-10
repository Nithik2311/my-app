import React, { useEffect, useState } from "react";
import styles from "./FeaturesSection.module.css";

const featuresData = [
  {
    title: "Live Bus Tracking",
    description: "Track your bus in real time and know exactly when it will arrive.",
    image: "/live-track.png",
    alt: "Live Tracking",
  },
  {
    title: "Smart Route Planner",
    description: "Get optimized routes based on distance and traffic conditions.",
    image: "/route-map.png",
    alt: "Route Planning",
  },
  {
    title: "Bus Scheduler",
    description: "Auto-generate bus schedules tailored to demand and timing.",
    image: "/schedule.png",
    alt: "Scheduler",
  },
];

const FeaturesSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5500); // Show GIF for 2.5 seconds
    return () => clearTimeout(timeout);
  }, []);

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
        <div key={index} className={`${styles["feature-card"]} ${styles.clickable}`}>
          <img src={feature.image} alt={feature.alt} />
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default FeaturesSection;
