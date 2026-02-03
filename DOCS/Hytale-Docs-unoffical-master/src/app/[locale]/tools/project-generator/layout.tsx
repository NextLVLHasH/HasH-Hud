import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Generator - HytaleDocs",
  description:
    "Generate a complete Hytale plugin or mod project structure with all necessary files and configurations.",
};

export default function ProjectGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
