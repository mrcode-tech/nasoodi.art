"use client";

import { useEffect } from "react";

/**
 * Applies the entrance overlay palette only while entrance copy or language
 * controls physically intersect the rendered artwork.
 */
export function EntranceOverlayColorObserver() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".entrance-page");
    const image = document.querySelector<HTMLImageElement>(".entrance-artwork");
    if (!page || !image) return;

    const targets = [
      ...document.querySelectorAll<HTMLElement>(
        ".entrance-copy h1, .entrance-welcome, .entrance-language-links",
      ),
    ];

    const intersects = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

    const update = () => {
      const imageBounds = image.getBoundingClientRect();
      const hasOverlay = targets.some((target) =>
        intersects(target.getBoundingClientRect(), imageBounds),
      );
      page.toggleAttribute("data-entrance-overlay", hasOverlay);
      if (hasOverlay) page.setAttribute("data-entrance-overlay", "true");
    };

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(image);
    targets.forEach((target) => resizeObserver.observe(target));
    window.addEventListener("resize", update);
    image.addEventListener("load", update);
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
      image.removeEventListener("load", update);
      page.removeAttribute("data-entrance-overlay");
    };
  }, []);

  return null;
}
