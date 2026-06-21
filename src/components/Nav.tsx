"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Accueil", icon: "🏠" },
  { href: "/recettes", label: "Recettes", icon: "🍽️" },
  { href: "/budget", label: "Budget", icon: "💶" },
  { href: "/courses", label: "Courses", icon: "🛒" },
  { href: "/frigo", label: "Frigo", icon: "🧊" },
  { href: "/batch-cooking", label: "Batch", icon: "📦" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      <header className="hidden sm:flex items-center justify-between px-6 py-4 bg-white border-b border-rose-100">
        <Link href="/" className="font-semibold text-[var(--color-primary-dark)]">
          🍓 Healthy Meal
        </Link>
        <nav className="flex gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-full text-sm transition ${
                pathname === link.href
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted)] hover:bg-rose-50"
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-rose-100 flex justify-between px-1 py-1.5 z-20">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl text-[11px] ${
              pathname === link.href
                ? "text-[var(--color-primary-dark)] font-medium"
                : "text-[var(--color-muted)]"
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
