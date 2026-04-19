import Link from "next/link";

export default function HomeNotFound() {
  return (
    <div className="error-boundary">
      <h2 className="error-boundary-title">Page not found</h2>
      <p className="error-boundary-message">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="error-boundary-btn">
        Go home
      </Link>
    </div>
  );
}
