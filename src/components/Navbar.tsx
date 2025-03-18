"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

const navItems = [
    {name: "Dashboard", href: "/dashboard"},
    {name: "Transactions", href: "/transactions"},
    {name: "Budgets", href: "/budgets"},
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link href={"/"} className="text-xl font-bold">
                    Finance Visualizer
                </Link>
                <div className="flex gap-4">
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
                {/* <Button variant="outline">Export Data</Button> */}
            </div>
        </nav>
    )
}