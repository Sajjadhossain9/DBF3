/**
 * Site-wide configuration. Edit here to update navigation, contact and integrations.
 */
export const site = {
  name: "Airborne Phoenix",
  shortName: "Airborne Phoenix",
  team: "AAUB DBF TEAM",
  university: "Aviation and Aerospace University, Bangladesh (AAUB)",
  tagline: "DESIGN • BUILD • FLY",
  email: "airbornephoenix.aaub@gmail.com", // TODO: replace with the official team address
  location: "Lalmonirhat, Bangladesh",
  founded: 2024, // TODO: confirm with team
  social: {
    facebook: "https://facebook.com/", // TODO
    linkedin: "https://linkedin.com/", // TODO
    youtube: "https://youtube.com/", // TODO
    instagram: "https://instagram.com/", // TODO
  },
  /** Analytics is architecture-ready but disabled by default (no invasive tracking). */
  analytics: {
    enabled: false,
    provider: "plausible" as "plausible" | "umami" | "none",
    domain: "",
  },
  /** Third-party form endpoint (e.g. Formspree). Leave empty to use mailto fallback. */
  formEndpoint: "",
  documents: {
    sponsorshipDeck: { path: "/documents/sponsorship-deck.pdf", available: false },
    technicalSummary: { path: "/documents/technical-summary.pdf", available: false },
    pressKit: { path: "/documents/press-kit.zip", available: false },
  },
};

export const nav = [
  { to: "/", label: "Home", num: "00" },
  { to: "/aircraft", label: "Aircraft", num: "01" },
  { to: "/engineering", label: "Engineering", num: "02" },
  { to: "/team", label: "Team", num: "03" },
  { to: "/gallery", label: "Gallery", num: "04" },
  { to: "/timeline", label: "Timeline", num: "05" },
  { to: "/sponsors", label: "Sponsors", num: "06" },
  { to: "/news", label: "News", num: "07" },
  { to: "/contact", label: "Contact", num: "08" },
];

/* ---------- Minimal i18n architecture (English primary, Bangla optional) ---------- */
export type Locale = "en" | "bn";
export const locales: Record<Locale, { label: string; dir: "ltr" }> = {
  en: { label: "English", dir: "ltr" },
  bn: { label: "বাংলা", dir: "ltr" },
};
export const dictionary: Record<Locale, Record<string, string>> = {
  en: {
    "hero.cta.aircraft": "Explore the aircraft",
    "hero.cta.sponsor": "Partner with us",
    "hero.status": "MISSION STATUS",
    "nav.menu": "Menu",
    "nav.search": "Search",
  },
  bn: {
    "hero.cta.aircraft": "উড়োজাহাজ দেখুন",
    "hero.cta.sponsor": "আমাদের সাথে অংশীদার হন",
    "hero.status": "মিশন স্ট্যাটাস",
    "nav.menu": "মেনু",
    "nav.search": "অনুসন্ধান",
  },
};
export function t(key: string, locale: Locale = "en") {
  return dictionary[locale][key] ?? dictionary.en[key] ?? key;
}
