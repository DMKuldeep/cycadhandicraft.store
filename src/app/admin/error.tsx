"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-100 p-6 text-center">
      <h2 className="mb-2 font-serif text-2xl font-bold text-earth-900">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-md text-earth-600">
        {error.message || "An error occurred in the admin panel."}
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <a href="/admin/login" className="btn-secondary">
          Back to login
        </a>
      </div>
    </div>
  );
}
