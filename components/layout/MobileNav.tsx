"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center text-foreground"
      >
        <Menu size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold text-primary">Menu</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center text-foreground"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col p-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-lg border-b border-border ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
