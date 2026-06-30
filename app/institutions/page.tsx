import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { INSTITUTIONS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Institutions | Darul Uloom Faizan-E-Ashraf",
  description:
    "Explore our institutions: Darse Nizami, Hifzul Quran College, Jamiathu Zahra, Senior Secondary School, and Iqra English Medium School.",
};

export default function InstitutionsPage() {
  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Our Institutions
        </h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Comprehensive Islamic education for every stage of learning
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSTITUTIONS.map((inst) => (
              <div
                key={inst.slug}
                className="group rounded-2xl border border-border bg-surface-elevated overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-semibold text-lg text-foreground mb-2">
                    {inst.name}
                  </h2>
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
        </div>
      </section>
    </>
  );
}
