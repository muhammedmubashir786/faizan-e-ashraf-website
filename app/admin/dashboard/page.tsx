import { Newspaper, Image as ImageIcon, GraduationCap, Mail } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabase();

  const [newsCount, mediaCount, resultsCount, messagesCount] =
    await Promise.all([
      supabase.from("news").select("*", { count: "exact", head: true }),
      supabase.from("gallery_media").select("*", { count: "exact", head: true }),
      supabase.from("exam_results").select("*", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false),
    ]);

  const stats = [
    { label: "News Articles", value: newsCount.count ?? 0, icon: Newspaper },
    { label: "Gallery Items", value: mediaCount.count ?? 0, icon: ImageIcon },
    { label: "Exam Results", value: resultsCount.count ?? 0, icon: GraduationCap },
    { label: "Unread Messages", value: messagesCount.count ?? 0, icon: Mail },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-1">Dashboard</h1>
      <p className="text-text-muted mb-8">
        Welcome back. Here&apos;s an overview of your website content.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface-elevated p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
