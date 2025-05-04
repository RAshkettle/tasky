"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// This empty component serves as a loading placeholder
const LoadingComponent = () => (
  <div className="min-h-screen bg-slate-200/95 dark:bg-gradient-to-t dark:from-black dark:to-purple-900"></div>
);

// Dynamically import the StickyNotesApp with SSR disabled
const StickyNotesAppNoSSR = dynamic(() => import("./sticky-notes-app"), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

export default function TodosPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <StickyNotesAppNoSSR />
    </Suspense>
  );
}
