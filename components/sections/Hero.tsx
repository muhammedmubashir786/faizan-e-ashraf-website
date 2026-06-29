import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-dark text-white">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--accent)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32 text-center">
        <p className="text-accent-light font-medium text-sm md:text-base mb-3 tracking-wide uppercase">
          Serving since {SITE.established}
        </p>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          Welcome to{" "}
          <span className="text-accent-light">Darul Uloom</span>
          <br />
          Faizan-E-Ashraf
        </h1>

        <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          {SITE.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admissions"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-primary-dark hover:bg-accent-light transition-colors"
          >
            Apply for Admission
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
