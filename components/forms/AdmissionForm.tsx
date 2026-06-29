"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { INSTITUTIONS } from "@/lib/constants";

export default function AdmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    institution: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // TODO: replace with real Supabase insert once backend is set up
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", phone: "", email: "", institution: "" });
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-surface-elevated p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Inquiry Submitted
        </h3>
        <p className="text-text-muted mb-6">
          Thank you for your interest. Our admissions team will contact you
          shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm font-semibold text-primary hover:text-primary-light"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface-elevated p-6 md:p-8 space-y-4"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          placeholder="Student's full name"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="institution"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Institution <span className="text-red-500">*</span>
        </label>
        <select
          id="institution"
          name="institution"
          required
          value={formData.institution}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        >
          <option value="" disabled>
            Select an institution...
          </option>
          {INSTITUTIONS.map((inst) => (
            <option key={inst.slug} value={inst.slug}>
              {inst.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-primary-dark hover:bg-accent-light transition-colors disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Inquiry"}
        {!submitting && <Send size={16} />}
      </button>
    </form>
  );
}
