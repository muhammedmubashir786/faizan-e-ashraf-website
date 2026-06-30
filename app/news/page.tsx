import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "News & Announcements | Darul Uloom Faizan-E-Ashraf",
  description:
    "Latest news, announcements, and events from Darul Uloom Faizan-E-Ashraf.",
};

export default async function NewsPage() {
  const supabase = await createServerSupabase();

  const { data: articles } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, category, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          News & Announcements
        </h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Stay updated with the latest from Darul Uloom Faizan-E-Ashraf
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="rounded-2xl border border-border bg-surface-elevated p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {article.category}
                  </span>
                  {article.published_at && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar size={12} />
                      {new Date(article.published_at).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {article.title}
                </h2>

                {article.excerpt && (
                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                )}

                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                >
                  Read More
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-text-muted">
              <p>No articles published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
