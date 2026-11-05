import cv from "./data/cv.json";
import type { CvDocument, CvEntry } from "../types/content";

export const cvEntries: CvEntry[] = cv.entries as CvEntry[];
const document = cv.document as CvDocument | null;
export const cvDocument: CvDocument | undefined = document ?? undefined;
