import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface-elevated/95 backdrop-blur-sm">
      <div className="hidden md:flex items-center justify-end gap-6 px-6 py-1.5 text-sm text-text-muted bg-primary text-white">
        <a
          href={`tel:${SITE.phone}`}
          className="flex items-center gap-1.5 hover:text-accent-light transition-colors"
        >
          <Phone size={14} />
          {SITE.phone}
        </a>
        <a
          href={`mailto:${SITE.email}`}
          className="hover:text-accent-light transition-colors"
        >
          {SITE.email}
        </a>
      </div>

      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt={SITE.name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
            priority
          />
          <div className="leading-tight">
            <p className="font-semibold text-primary text-sm md:text-base">
              Darul Uloom
            </p>
            <p className="text-xs md:text-sm text-accent-dark font-medium">
              Faizan-E-Ashraf
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/admissions"
            className="hidden md:inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold text-primary-dark hover:bg-accent-light transition-colors"
          >
            Apply Now
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
