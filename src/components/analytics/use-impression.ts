"use client";

import { useCallback, useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/** Fire `impression` once when the attached element first crosses into view.
 *  Returns a ref callback — pass it directly as `ref` on any host element.
 */
export function useImpression(element: string, id?: string) {
  const firedRef = useRef(false);
  const obsRef = useRef<IntersectionObserver | null>(null);

  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      obsRef.current?.disconnect();
      if (!node || typeof IntersectionObserver === "undefined") return;
      firedRef.current = false;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !firedRef.current) {
              firedRef.current = true;
              track({ name: "impression", props: { element, id } });
              obs.disconnect();
            }
          }
        },
        { threshold: 0.5 },
      );
      obsRef.current = obs;
      obs.observe(node);
    },
    [element, id],
  );

  // Disconnect on unmount.
  useEffect(() => () => obsRef.current?.disconnect(), []);

  return refCallback;
}
