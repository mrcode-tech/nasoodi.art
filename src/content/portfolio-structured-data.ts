// JSON-LD contains only owner-supplied identity facts that are also visible on the homepage.
export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://nasoodi.art/#artist",
      name: "Ghazaleh Abdolahzade Nasoodi",
      alternateName: "غزاله عبداله زاده نسودی",
      jobTitle: "Oil painter",
      url: "https://nasoodi.art/",
    },
    {
      "@type": "WebSite",
      "@id": "https://nasoodi.art/#website",
      name: "Nasoodi.art",
      url: "https://nasoodi.art/",
      inLanguage: ["fa", "en"],
      publisher: { "@id": "https://nasoodi.art/#artist" },
    },
  ],
} as const;
