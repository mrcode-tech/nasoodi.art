import profile from "./data/artist-profile.json";
import type { ArtistProfile } from "../types/content";

export const artistProfile: ArtistProfile | undefined = profile ?? undefined;
