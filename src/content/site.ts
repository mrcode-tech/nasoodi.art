import site from "./data/site.json";
import type { Locale } from "../types/locale";

type LocalizedPageMetadata = {
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const siteContent = site as {
  id: string;
  pages: Record<"works" | "galleries" | "journal" | "cv", LocalizedPageMetadata>;
};
