"use client";

import dynamic from "next/dynamic";

const SourceField = dynamic(() => import("@/components/SourceField"), { ssr: false });

export default function SourceFieldClient({ className }: { className?: string }) {
  return <SourceField className={className} />;
}
