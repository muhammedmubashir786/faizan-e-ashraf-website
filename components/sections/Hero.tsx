import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/campus.jpg"
          alt="Darul Uloom Faizan-E-Ashraf campus"
          fill
          priority
          className="object-cover brightness-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,18,40,0.35), rgba(8,18,40,0.55))",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32 text-center">
        <p
          className="text-accent-light font-medium text-sm md:text-base mb-3 tracking-wide uppercase"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
        >
          Serving since {SITE.established}
        </p>

        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          Welcome to{" "}
          <span className="text-accent-light">Darul Uloom</span>
          <br />
          Faizan-E-Ashraf
        </h1>

        <p
          className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
        >
          {SITE.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admissions"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-primary-dark hover:bg-accent-light transition-colors shadow-lg"
          >
            Apply for Admission
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-7 py-3 font-semibold text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
