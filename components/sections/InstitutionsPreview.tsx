import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { INSTITUTIONS } from "@/lib/constants";

export default function InstitutionsPreview() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-surface">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3">
            Our Institutions
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Comprehensive Islamic education for every stage of learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSTITUTIONS.map((inst) => (
            <div
              key={inst.slug}
              className="group rounded-2xl border border-border bg-surface-elevated overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={inst.image}
                  alt={inst.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {inst.name}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">
                  {inst.description}
                </p>
                <Link
                  href={`/institutions/${inst.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all"
                >
                  Learn More
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/institutions"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white hover:bg-primary-light transition-colors"
          >
            View All Institutions
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
