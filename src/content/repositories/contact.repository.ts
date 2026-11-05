import { contactDetails } from "../contact";
import { getPublicContactDetails } from "../../lib/content/publication";
import type { Locale } from "../../types/locale";

export function getContact(locale: Locale) {
  const details = getPublicContactDetails(contactDetails);
  const title = contactDetails.title?.[locale];
  const description = contactDetails.description?.[locale];
  if (!details || !title || !description) return undefined;
  return { title, description, details };
}
