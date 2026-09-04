/**
 * Sponsor management. Add logos to /public/images/sponsors/<id>.svg (preferred) or .png (min 600px wide, transparent).
 * Tiers, benefits and figures must be approved by the team before publishing — placeholders are marked.
 */
export interface Sponsor { id: string; name: string; tier: string; logo?: string; url?: string; since?: string }

export const sponsorTiers = [
  { id: "title", name: "Title Partner", note: "Benefits pending team approval" },
  { id: "gold", name: "Gold", note: "Benefits pending team approval" },
  { id: "silver", name: "Silver", note: "Benefits pending team approval" },
  { id: "in-kind", name: "In-kind / Technical", note: "Benefits pending team approval" },
];

/** Empty until partners are confirmed. */
export const sponsors: Sponsor[] = [];

export const contributionCategories = [
  { id: "financial", name: "Financial support", detail: "Competition fees, shipping, and airframe material budget.", icon: "coin" },
  { id: "composites", name: "Composite materials", detail: "Carbon and glass fabric, epoxy systems, core materials, vacuum consumables.", icon: "layers" },
  { id: "electronics", name: "Electronics & avionics", detail: "Flight controllers, telemetry radios, sensors, servos, connectors.", icon: "chip" },
  { id: "power", name: "Motors, ESCs & batteries", detail: "Brushless motors, ESCs, LiPo packs, chargers and safety equipment.", icon: "bolt" },
  { id: "tools", name: "Tools & manufacturing", detail: "Laser-cutting time, 3D printing, hand tools, workshop consumables.", icon: "tool" },
  { id: "software", name: "Software & simulation", detail: "CAD, CFD and FEA licences, project-management tooling.", icon: "code" },
  { id: "travel", name: "Travel & accommodation", detail: "Team travel, aircraft transport and lodging during competition.", icon: "plane" },
  { id: "media", name: "Media partnership", detail: "Coverage, documentary production and outreach amplification.", icon: "camera" },
];

/** Media reach fields — leave null until measured figures are approved. */
export const mediaReach: { label: string; value: string | null }[] = [
  { label: "Social followers", value: null },
  { label: "Campus audience", value: null },
  { label: "Event attendance", value: null },
  { label: "Press features", value: null },
];

export const partnershipBenefits = [
  "Logo placement on aircraft, team apparel and pit display (subject to tier approval)",
  "Recognition on website, design report and presentations",
  "Access to student talent for recruitment and internships",
  "Technical case studies and content collaboration",
  "Invitations to flight-test days and season showcase",
];
