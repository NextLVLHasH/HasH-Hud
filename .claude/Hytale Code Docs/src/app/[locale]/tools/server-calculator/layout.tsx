import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Server Calculator - HytaleDocs",
  description:
    "Calculate recommended RAM, CPU and storage for your Hytale server based on player count and view distance.",
};

export default function ServerCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
