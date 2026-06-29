import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CVEditor from "@/components/cv/cv-editor";
import "../cv.css";

export const metadata: Metadata = {
  title: "CV editor",
  robots: { index: false, follow: false },
};

// Private editing lab. Dev-only: in a production build this 404s, so it never
// ships publicly — no auth needed since it's only ever used locally.
export default function CVEditPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <CVEditor />;
}
