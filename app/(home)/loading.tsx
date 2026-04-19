export default function HomeLoading() {
  return (
    <div className="grid-page">
      <div className="filter-section">
        <div className="sport-filter">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-btn" />
          ))}
        </div>
        <div className="skeleton skeleton-input" />
      </div>
      <div className="grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    </div>
  );
}
