"use client";

import { useEffect } from "react";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-boundary">
      <h2 className="error-boundary-title">Failed to load profile</h2>
      <p className="error-boundary-message">
        Something went wrong while loading your profile. Please try again.
      </p>
      <button className="error-boundary-btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
