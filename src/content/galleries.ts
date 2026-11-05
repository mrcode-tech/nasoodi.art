import galleryRecords from "./data/galleries.json";
import type { Gallery } from "../types/content";

export const galleries: Gallery[] = galleryRecords as unknown as Gallery[];
