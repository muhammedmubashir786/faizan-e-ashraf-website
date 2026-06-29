import { BookOpen, Users, Award, Heart } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Quality Education",
    description:
      "A balanced, comprehensive Islamic and modern curriculum designed for the holistic development of every student.",
  },
  {
    icon: Users,
    title: "Experienced Faculty",
    description:
      "Qualified scholars and educators dedicated to mentorship and providing personalized attention to learners.",
  },
  {
    icon: Award,
    title: "Excellence in Learning",
    description:
      "State-of-the-art facilities and a quiet environment optimized for growth, focus, and academic success.",
  },
  {
    icon: Heart,
    title: "Character Building",
    description:
      "Strong emphasis on developing Islamic values, noble ethics, and a sense of responsibility toward society.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3">
            Why Choose Us
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Discover what makes us the preferred choice for Islamic education
            and modern academic success
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-surface-elevated p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
