"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { Button } from "@/components/ui/button";

type CarouselContextValue = {
  carouselRef: UseEmblaCarouselType[0];
  api: EmblaCarouselType | undefined;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedSlide: number;
  slideCount: number;
  dir: "ltr" | "rtl";
};
const CarouselContext = React.createContext<CarouselContextValue | null>(null);
function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("Carousel components must be used inside <Carousel />");
  return context;
}
type CarouselProps = React.HTMLAttributes<HTMLDivElement> & { dir?: "ltr" | "rtl"; label: string; roleDescription?: string; opts?: EmblaOptionsType };

export function Carousel({ dir = "ltr", label, roleDescription = "carousel", opts, className, children, onKeyDown, onFocusCapture, ...props }: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", loop: false, ...opts, direction: dir });
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    if (!api) return () => undefined;
    api.on("select", onStoreChange);
    api.on("reInit", onStoreChange);
    return () => { api.off("select", onStoreChange); api.off("reInit", onStoreChange); };
  }, [api]);
  const getSnapshot = React.useCallback(() => api
    ? `${api.canScrollPrev() ? 1 : 0}:${api.canScrollNext() ? 1 : 0}:${api.selectedScrollSnap()}:${api.slideNodes().length}`
    : "0:0:0:0", [api]);
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, () => "0:0:0:0");
  const [previousValue, nextValue, selectedSlide, slideCount] = snapshot.split(":").map(Number);
  const canScrollPrev = previousValue === 1;
  const canScrollNext = nextValue === 1;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !api) return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
    const previousKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const nextKey = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    if (event.key === previousKey && api.canScrollPrev()) { event.preventDefault(); api.scrollPrev(); }
    else if (event.key === nextKey && api.canScrollNext()) { event.preventDefault(); api.scrollNext(); }
  };
  const handleFocusCapture = (event: React.FocusEvent<HTMLDivElement>) => {
    onFocusCapture?.(event);
    if (event.defaultPrevented || !api || !(event.target instanceof HTMLElement)) return;
    const slide = event.target.closest(".carousel-item");
    if (!slide) return;
    const index = Array.from(event.currentTarget.querySelectorAll(".carousel-item")).indexOf(slide);
    if (index >= 0 && !api.slidesInView().includes(index)) api.scrollTo(index);
  };
  return (
    <CarouselContext.Provider value={{ carouselRef, api, canScrollPrev, canScrollNext, selectedSlide, slideCount, dir }}>
      <div {...props} dir={dir} role="region" aria-roledescription={roleDescription} aria-label={label}
        className={["carousel", className].filter(Boolean).join(" ")} onKeyDown={handleKeyDown} onFocusCapture={handleFocusCapture}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}
export function CarouselContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { carouselRef } = useCarousel();
  return <div ref={carouselRef} className="carousel-viewport"><div {...props} className={["carousel-track", className].filter(Boolean).join(" ")}>{children}</div></div>;
}
export function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="group" aria-roledescription="slide" className={["carousel-item", className].filter(Boolean).join(" ")} />;
}
type ControlProps = { label: string; className?: string };
export function CarouselPrevious({ label, className }: ControlProps) {
  const { api, canScrollPrev, dir } = useCarousel();
  return <Button type="button" variant="outline" size="sm" className={["carousel-control", className].filter(Boolean).join(" ")} aria-label={label} disabled={!canScrollPrev} onClick={() => api?.scrollPrev()}><span aria-hidden="true">{dir === "rtl" ? "→" : "←"}</span></Button>;
}
export function CarouselNext({ label, className }: ControlProps) {
  const { api, canScrollNext, dir } = useCarousel();
  return <Button type="button" variant="outline" size="sm" className={["carousel-control", className].filter(Boolean).join(" ")} aria-label={label} disabled={!canScrollNext} onClick={() => api?.scrollNext()}><span aria-hidden="true">{dir === "rtl" ? "←" : "→"}</span></Button>;
}
export function CarouselStatus({ label }: { label: string }) {
  const { selectedSlide, slideCount } = useCarousel();
  return <span className="carousel-status" aria-live="polite" aria-atomic="true" aria-label={label}>{slideCount ? `${selectedSlide + 1} / ${slideCount}` : "0 / 0"}</span>;
}
