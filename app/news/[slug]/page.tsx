import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("news")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) return { title: "Article Not Found" };
  return {
    title: `${data.title} | Darul Uloom Faizan-E-Ashraf`,
    description: data.excerpt ?? undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: article } = await supabase
    .from("news")
    .select("title, content, category, published_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!article) notFound();

  return (
    <>
      <section className="bg-primary-dark text-white py-14 md:py-20 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-accent-light mb-4"
          >
            <ArrowLeft size={16} />
            Back to News
          </Link>
          <span className="inline-block rounded-full bg-accent/20 text-accent-light px-3 py-1 text-xs font-semibold capitalize mb-3">
            {article.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold">{article.title}</h1>
          {article.published_at && (
            <p className="flex items-center gap-1.5 text-white/60 text-sm mt-3">
              <Calendar size={14} />
              {new Date(article.published_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      </section>
    </>
  );
}
