export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="container-narrow text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold text-earth-900">
          404
        </h1>
        <p className="mb-8 text-earth-600">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a href="/" className="btn-primary">
          Go Home
        </a>
      </div>
    </section>
  );
}
