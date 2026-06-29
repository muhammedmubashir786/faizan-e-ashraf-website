import type { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Darul Uloom Faizan-E-Ashraf",
  description:
    "Get in touch with Darul Uloom Faizan-E-Ashraf in Nagaur, Rajasthan. Find our address, phone number, email, and location on the map.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-white/80 max-w-xl mx-auto">
          We are here to help you. Reach out to us for any inquiries.
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Send us a Message
            </h2>
            <p className="text-text-muted mb-6">
              Have a question? Fill out the form below and we&apos;ll get back
              to you shortly.
            </p>
            <ContactForm />
          </div>

          {/* Info + Map */}
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              Get in Touch
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Our Location
                  </p>
                  <p className="text-sm text-text-muted">{SITE.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Call Us</p>
                  <a
                    href={`tel:${SITE.phone}`}
                    className="text-sm text-text-muted hover:text-primary"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email Us</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sm text-text-muted hover:text-primary"
                  >
                    {SITE.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3]">
              <iframe
                src={SITE.mapEmbedUrl}
                title="School Location Map"
                className="h-full w-full"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
