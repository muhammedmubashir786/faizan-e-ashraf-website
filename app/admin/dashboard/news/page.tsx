import Link from "next/link";
import { Plus } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import NewsRow from "./NewsRow";

export default async function NewsListPage() {
  const supabase = await createServerSupabase();

  const { data: articles } = await supabase
    .from("news")
    .select("id, title, category, published, published_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">News & Announcements</h1>
          <p className="text-text-muted text-sm">
            Manage articles, announcements, and events
          </p>
        </div>
        <Link
          href="/admin/dashboard/news/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
        >
          <Plus size={16} />
          Add Article
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-surface-elevated overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-text-muted">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Title</th>
              <th className="px-4 py-3 whitespace-nowrap">Category</th>
              <th className="px-4 py-3 whitespace-nowrap">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((article) => (
              <NewsRow key={article.id} article={article} />
            ))}
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  No articles added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
