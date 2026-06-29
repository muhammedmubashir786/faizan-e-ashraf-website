"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menu = (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          zIndex: 9998,
          backgroundColor: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "78%",
          maxWidth: "320px",
          height: "100dvh",
          zIndex: 9999,
          backgroundColor: "#0b1120",
          borderLeft: "1px solid rgba(224,188,74,0.25)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: open ? "-12px 0 32px rgba(0,0,0,0.45)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid rgba(224,188,74,0.2)",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#e0bc4a", fontWeight: 700, fontSize: "18px", letterSpacing: "0.02em" }}>
            MENU
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              display: "flex",
              height: "36px",
              width: "36px",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", padding: "10px 0", overflowY: "auto", flex: 1 }}>
          {NAV_LINKS.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  color: isActive ? "#f0d572" : "#e8eaf0",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "16px",
                  padding: "15px 22px",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(16px)",
                  transition: `opacity 0.25s ease ${index * 0.035}s, transform 0.25s ease ${index * 0.035}s, background-color 0.2s ease`,
                  borderLeft: isActive ? "3px solid #e0bc4a" : "3px solid transparent",
                  backgroundColor: isActive ? "rgba(224,188,74,0.1)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center text-foreground"
      >
        <Menu size={24} />
      </button>

      {mounted && createPortal(menu, document.body)}
    </div>
  );
}
