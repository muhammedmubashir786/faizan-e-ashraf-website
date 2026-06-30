import type { Metadata } from "next";
import { Home, Shield, Utensils, BookOpen, Users, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Hostel Facilities | Darul Uloom Faizan-E-Ashraf",
  description:
    "Comfortable and supervised hostel accommodation for students at Darul Uloom Faizan-E-Ashraf, with separate facilities for boys and girls.",
};

const FACILITIES = [
  {
    icon: Home,
    title: "Comfortable Accommodation",
    description:
      "Clean, well-ventilated rooms providing a comfortable living environment for resident students.",
  },
  {
    icon: Shield,
    title: "24/7 Supervision",
    description:
      "Dedicated wardens and staff ensure student safety and discipline around the clock.",
  },
  {
    icon: Utensils,
    title: "Nutritious Meals",
    description:
      "Hygienic, balanced meals served daily to support students' health and growth.",
  },
  {
    icon: BookOpen,
    title: "Study Environment",
    description:
      "Quiet study halls and structured routines that support academic and religious learning.",
  },
  {
    icon: Users,
    title: "Separate Wings",
    description:
      "Independent, fully supervised accommodation wings for boys and girls.",
  },
  {
    icon: Heart,
    title: "Pastoral Care",
    description:
      "A caring, family-like atmosphere that supports students' emotional and spiritual wellbeing.",
  },
];

export default function HostelPage() {
  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Hostel Facilities
        </h1>
        <p className="text-white/80 max-w-xl mx-auto">
          A safe, supportive home away from home for our resident students
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Life at Our Hostel
          </h2>
          <p className="text-text-muted leading-relaxed">
            Our hostel provides a nurturing residential environment for
            students pursuing their education at Darul Uloom
            Faizan-E-Ashraf. With separate, fully supervised wings for boys
            and girls, we ensure every student has a safe, disciplined, and
            comfortable space to live, study, and grow spiritually.
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((facility) => {
            const Icon = facility.icon;
            return (
              <div
                key={facility.title}
                className="rounded-2xl border border-border bg-surface-elevated p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {facility.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {facility.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
