"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Transactions", href: "/transactions" },
  { name: "Budgets", href: "/budgets" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4 md:p-6">
        <Link href={"/"} className="text-xl font-bold">
          Finance Visualizer
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute top-16 left-0 w-full bg-white shadow-md md:hidden flex flex-col text-center transition-all duration-300 ease-in-out ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none hidden"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block text-gray-600 hover:text-black transition-all px-4 py-2",
                pathname === item.href ? "text-black font-semibold" : ""
              )}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:flex-row gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-gray-600 hover:text-black transition-all px-4 py-2",
                pathname === item.href ? "text-black font-semibold" : ""
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
