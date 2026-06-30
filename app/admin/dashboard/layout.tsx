import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Newspaper, Image as ImageIcon, GraduationCap, LogOut } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "News", href: "/admin/dashboard/news", icon: Newspaper },
    { label: "Gallery", href: "/admin/dashboard/gallery", icon: ImageIcon },
    { label: "Results", href: "/admin/dashboard/results", icon: GraduationCap },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row">
      <aside className="md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-surface-elevated p-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 px-2">
          Admin Panel
        </p>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors whitespace-nowrap"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action="/admin/logout" method="post" className="mt-4 md:mt-6">
          <button
            type="submit"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
