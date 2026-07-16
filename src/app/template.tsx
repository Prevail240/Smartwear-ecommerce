"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      animate(
        containerRef.current,
        { opacity: [0, 1], y: [10, 0] },
        { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
      );
    }
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
