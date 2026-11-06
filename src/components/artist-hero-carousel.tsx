"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const portraits = [
  {
    src: "/images/artist/artist-at-work.jpg",
    alt: {
      en: "Ghazaleh Abdolahzade Nasoodi at work in her studio",
      fa: "غزاله عبداله‌زاده نسودی در حال کار در آتلیه",
    },
  },
  {
    src: "/images/artist/artist-portrait.jpg",
    alt: {
      en: "Portrait of Ghazaleh Abdolahzade Nasoodi",
      fa: "پرتره غزاله عبداله‌زاده نسودی",
    },
  },
] as const;

type Props = {
  locale: "en" | "fa";
  alt: string;
};

export function ArtistHeroCarousel({ locale, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % portraits.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <figure className="hero-artwork artist-hero-carousel" aria-label={alt}>
      {portraits.map((portrait, index) => (
        <Image
          key={portrait.src}
          className={`artist-hero-image${activeIndex === index ? " is-active" : ""}`}
          src={portrait.src}
          alt={portrait.alt[locale]}
          fill
          sizes="(max-width: 900px) 100vw, 58vw"
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
      ))}
    </figure>
  );
}
