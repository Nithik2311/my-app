export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card clickable" tabIndex={0}>
      <img src={icon} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
