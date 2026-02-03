import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Validator - HytaleDocs",
  description:
    "Validate your Hytale JSON files (blocks, items, NPCs, manifest) against official schemas.",
};

export default function JsonValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
