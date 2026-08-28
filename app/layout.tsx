import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "@/components/PostHogProvider";

export const metadata: Metadata = {
  title: "AI Learning Mentor | Next-Gen Education Platform",
  description: "Personalized AI teaching, real-world case studies, AI-generated videos, interactive mentoring, and real-time token, cost, and latency telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0c0c0e] text-zinc-100 min-h-screen">
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
