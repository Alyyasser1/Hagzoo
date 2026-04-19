"use client";

import { useEffect } from "react";

export default function HomeError({
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
      <h2 className="error-boundary-title">Something went wrong</h2>
      <p className="error-boundary-message">
        Failed to load rooms. Please try again.
      </p>
      <button className="error-boundary-btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
