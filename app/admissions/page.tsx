import type { Metadata } from "next";
import { FileText, CheckCircle, Clock, Users } from "lucide-react";
import AdmissionForm from "@/components/forms/AdmissionForm";

export const metadata: Metadata = {
  title: "Admissions | Darul Uloom Faizan-E-Ashraf",
  description:
    "Apply for admission to Darul Uloom Faizan-E-Ashraf. Choose from Darse Nizami, Hifzul Quran, girls' education, secondary school, or English medium programs.",
};

const STEPS = [
  {
    icon: FileText,
    title: "Application",
    description: "Complete the inquiry form above",
  },
  {
    icon: CheckCircle,
    title: "Eligibility",
    description: "Meet age and educational criteria",
  },
  {
    icon: Clock,
    title: "Timing",
    description: "Apply during open periods",
  },
  {
    icon: Users,
    title: "Interview",
    description: "Attend the personal interview",
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Admissions</h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Begin your journey of knowledge and spiritual growth
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-primary mb-2 text-center">
            Admission Inquiry Form
          </h2>
          <p className="text-text-muted mb-8 text-center">
            Fill out the form below to express your interest.
          </p>
          <AdmissionForm />
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 md:px-6 bg-surface">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-12">
            Admission Requirements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-surface-elevated p-6 text-center"
                >
                  <div className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-primary-dark text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 mx-auto">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
