"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton is available from shadcn/ui

// Dynamically import the CanvasDrawingBoard component to ensure it's client-side
// and to show a loading skeleton while it's being loaded.
const CanvasDrawingBoard = dynamic(
  () => import("../components/CanvasDrawingBoard"),
  {
    ssr: false, // Ensure this component is only rendered on the client side
    loading: () => (
      <div className="flex flex-col space-y-3 p-4">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    ),
  }
);

export default function CanvasPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 font-pacifico">
        Your Creative Canvas
      </h1>
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <CanvasDrawingBoard />
      </div>
    </div>
  );
}