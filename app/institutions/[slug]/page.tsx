import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { INSTITUTIONS } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return INSTITUTIONS.map((inst) => ({ slug: inst.slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const institution = INSTITUTIONS.find((inst) => inst.slug === slug);

  if (!institution) {
    return { title: "Institution Not Found" };
  }

  return {
    title: `${institution.name} | Darul Uloom Faizan-E-Ashraf`,
    description: institution.description,
  };
}

export default async function InstitutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const institution = INSTITUTIONS.find((inst) => inst.slug === slug);

  if (!institution) {
    notFound();
  }

  const otherInstitutions = INSTITUTIONS.filter((inst) => inst.slug !== slug);

  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/institutions"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-accent-light mb-4"
          >
            <ArrowLeft size={16} />
            Back to Institutions
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold">
            {institution.name}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative h-56 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image
              src={institution.image}
              alt={institution.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <p className="text-text-muted text-base md:text-lg leading-relaxed mb-8">
            {institution.description}
          </p>

          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-primary-dark hover:bg-accent-light transition-colors"
          >
            Apply to This Institution
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 md:px-6 bg-surface">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
            Other Institutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherInstitutions.map((inst) => (
              <Link
                key={inst.slug}
                href={`/institutions/${inst.slug}`}
                className="rounded-xl border border-border bg-surface-elevated p-4 hover:shadow-md transition-all"
              >
                <p className="font-semibold text-foreground text-sm">
                  {inst.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
