"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type BiographyDisclosureProps = {
  biography: string;
  readMoreLabel: string;
  showLessLabel: string;
  lines?: number;
};

export function BiographyDisclosure({ biography, readMoreLabel, showLessLabel, lines = 4 }: BiographyDisclosureProps) {
  const contentId = useId();
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isLong, setIsLong] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const measure = () => {
      if (expanded) return;
      const clone = element.cloneNode(true) as HTMLParagraphElement;
      clone.className = "biography-copy";
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.pointerEvents = "none";
      clone.style.top = "-100000px";
      clone.style.left = "-100000px";
      clone.style.width = element.getBoundingClientRect().width + "px";
      clone.style.height = "auto";
      clone.style.maxHeight = "none";
      clone.style.overflow = "visible";
      clone.style.display = "block";
      clone.style.setProperty("-webkit-line-clamp", "unset");
      clone.style.setProperty("line-clamp", "unset");
      document.body.appendChild(clone);
      const fullHeight = clone.getBoundingClientRect().height;
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
      clone.remove();
      setIsLong(Number.isFinite(lineHeight) && fullHeight > lineHeight * lines + 1);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [biography, expanded]);

  return (
    <div className="biography-disclosure">
      <p ref={contentRef} id={contentId}
        className={expanded ? "biography-copy is-expanded" : "biography-copy is-collapsed"}
        style={{ "--biography-lines": lines } as React.CSSProperties}>
        {biography}
      </p>
      {isLong && <Button type="button" variant="ghost" className="biography-toggle"
        aria-expanded={expanded} aria-controls={contentId}
        onClick={() => setExpanded((value) => !value)}>
        {expanded ? showLessLabel : readMoreLabel}
      </Button>}
    </div>
  );
}
