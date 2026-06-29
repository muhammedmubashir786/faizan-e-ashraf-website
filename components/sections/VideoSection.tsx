export default function VideoSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3">
          Watch Our Documentary
        </h2>
        <p className="text-text-muted mb-10">
          Experience the journey and atmosphere of Darul Uloom
          Faizan-E-Ashraf
        </p>

        <div className="relative w-full overflow-hidden rounded-2xl shadow-xl aspect-video">
          <iframe
            src="https://www.youtube.com/embed/nz34zpf_j9c"
            title="Darul Uloom Faizan-E-Ashraf Documentary"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
