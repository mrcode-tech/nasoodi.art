import entries from "./data/cv-entries.json";
import document from "./data/cv-document.json";
import type { CvDocument, CvEntry } from "../types/content";

export const cvEntries: CvEntry[] = entries as CvEntry[];
// No artist-approved public CV PDF has been supplied yet.
export const cvDocument: CvDocument | undefined = document ?? undefined;
