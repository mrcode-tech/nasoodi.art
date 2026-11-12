import navigation from "./navigation.json";
import common from "./common.json";
import home from "./home.json";
import artwork from "./artwork.json";
import galleries from "./galleries.json";
import journal from "./journal.json";
import about from "./about.json";
import contact from "./contact.json";
import entrance from "./entrance.json";

// Keep the runtime catalog flat so existing translation calls and typed keys stay stable.
const messages = {
  ...navigation,
  ...common,
  ...home,
  ...artwork,
  ...galleries,
  ...journal,
  ...about,
  ...contact,
  ...entrance,
};

export default messages;
