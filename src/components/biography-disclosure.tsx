"use client";

import { useEffect, useId, useRef, useState } from "react";

type BiographyDisclosureProps = {
  biography: string;
  readMoreLabel: string;
  showLessLabel: string;
  lines?: number;
  alwaysShowToggle?: boolean;
};

export function BiographyDisclosure({
  biography,
  readMoreLabel,
  showLessLabel,
  lines = 4,
  alwaysShowToggle = false,
}: BiographyDisclosureProps) {
  const contentId = useId();
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isLong, setIsLong] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (!element || alwaysShowToggle) return;

    const measure = () => {
      if (expanded) return;
      const clone = element.cloneNode(true) as HTMLParagraphElement;
      clone.className = "biography-copy";
      Object.assign(clone.style, {
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
        top: "-100000px",
        left: "-100000px",
        width: `${element.getBoundingClientRect().width}px`,
        height: "auto",
        maxHeight: "none",
        overflow: "visible",
        display: "block",
      });
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
  }, [alwaysShowToggle, biography, expanded, lines]);

  return (
    <div className="biography-disclosure">
      <p
        ref={contentRef}
        id={contentId}
        className={expanded ? "biography-copy is-expanded" : "biography-copy is-collapsed"}
        style={{ "--biography-lines": lines } as React.CSSProperties}
      >
        {biography}
      </p>
      {(alwaysShowToggle || isLong) && (
        <button
          type="button"
          className="ui-button biography-toggle"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? showLessLabel : readMoreLabel}
        </button>
      )}
    </div>
  );
}
