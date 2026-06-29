import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-primary text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Ready to Begin Your Educational Journey?
        </h2>
        <p className="text-white/80 mb-8">
          Join one of our esteemed institutions and embark on a path of
          knowledge.
        </p>
        <Link
          href="/admissions"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 font-semibold text-primary-dark hover:bg-accent-light transition-colors"
        >
          Apply for Admission
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
