export default function ProfileLoading() {
  return (
    <div className="profile-page">
      {/* ProfileCard skeleton */}
      <div className="profile-hero skeleton-surface">
        <div className="profile-top">
          <div className="skeleton skeleton-avatar" />
          <div
            className="player-info"
            style={{
              flex: 1,
              gap: "8px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="skeleton skeleton-text-lg" />
            <div className="skeleton skeleton-text-sm" />
            <div className="skeleton skeleton-text-sm" />
          </div>
        </div>
        <div className="profile-stats">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-stat" />
          ))}
        </div>
      </div>

      <hr className="room-divider" />

      {/* Rooms skeleton */}
      <div className="rooms">
        <div
          className="skeleton skeleton-text-md"
          style={{ width: "80px", margin: "0 auto 16px" }}
        />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    </div>
  );
}
