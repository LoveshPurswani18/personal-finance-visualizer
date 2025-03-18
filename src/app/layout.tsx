import type { Metadata } from "next";
import "../styles/globals.css";
import {Inter} from 'next/font/google'
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Yardstick Assingment",
    description: "Personal Finance Visualizer",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                <main className="container mx-auto p-4">{children}</main>
            </body>
        </html>
    )
}