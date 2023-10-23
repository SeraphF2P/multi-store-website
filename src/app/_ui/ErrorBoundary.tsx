"use client";

import { type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  children: ReactNode;
};
export default function SuspenseErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div
          className={`text-red  flex w-full items-center justify-center gap-4 bg-transparent p-4`}
        >
          <span> Could not fetch the data</span>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
