import profile from "./data/artist-profile.json";
import nameAliases from "./data/artist-name-aliases.json";
import type { ArtistNameAliasInventory, ArtistProfile } from "../types/content";

export const artistProfile: ArtistProfile = {
  ...profile,
  nameAliases: nameAliases as ArtistNameAliasInventory,
};
