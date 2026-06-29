import type { Metadata } from "next";
import { BookOpen, Heart, GraduationCap, HandHeart } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Darul Uloom Faizan-E-Ashraf",
  description:
    "Learn about the history, vision, and mission of Darul Uloom Faizan-E-Ashraf, an Islamic educational institution in Nagaur, Rajasthan, serving since 1997.",
};

const MISSION_POINTS = [
  {
    icon: BookOpen,
    title: "Comprehensive Islamic Education",
    description:
      "Providing authentic Islamic knowledge through traditional curriculum.",
  },
  {
    icon: Heart,
    title: "Character Development",
    description: "Nurturing students with strong moral values and ethics.",
  },
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description:
      "Maintaining high educational standards with modern methodologies.",
  },
  {
    icon: HandHeart,
    title: "Community Service",
    description:
      "Preparing students to serve their communities with compassion.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">About Us</h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Discover our journey, vision, and commitment to excellence
        </p>
      </section>

      {/* History */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            Our Rich History
          </h2>
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              {SITE.name} was established with a noble vision to provide
              authentic Islamic education while preparing students for the
              challenges of the modern world.
            </p>
            <p>
              Our founder envisioned an institution where students could
              receive comprehensive Islamic education rooted in the
              traditional Darse Nizami curriculum while also gaining the
              knowledge and skills necessary to succeed in contemporary
              society.
            </p>
            <p>
              Located in Ashraf Nagar, Basni Behlima, Nagaur, our campus has
              become a hub of learning and spiritual growth.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-surface">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Our Vision
          </h2>
          <p className="text-text-muted leading-relaxed text-base md:text-lg">
            To be a leading center of Islamic education that produces
            scholars, leaders, and responsible citizens who embody the
            teachings of Islam and contribute positively to society.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              Our Mission
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              We are committed to providing quality Islamic education that
              transforms lives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MISSION_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="rounded-2xl border border-border bg-surface-elevated p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent-dark mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {point.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {point.description}
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
