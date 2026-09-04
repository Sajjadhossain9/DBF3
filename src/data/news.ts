import { IMG } from "./media";

export interface Article {
  slug: string; title: string; date: string; category: "Team" | "Engineering" | "Competition" | "Press";
  excerpt: string; image: number; readMinutes: number; author: string; body: string[]; tags: string[];
}

export const articles: Article[] = [
  {
    slug: "ap-2-programme-launch", title: "Phoenix Mk II programme launched for the 2026 season", date: "Pending confirmation", category: "Engineering",
    excerpt: "The second-generation aircraft moves from concept to detailed design with a composite wing and modular payload bay.",
    image: IMG.assembly, readMinutes: 4, author: "Airborne Phoenix",
    body: [
      "Following lessons learned from the Phoenix Mk I trainer, the team has formally opened the AP-2 programme. The new aircraft targets the payload-carrying mission profile defined by the competition rules and shifts the airframe to a composite wing with a laser-cut plywood fuselage.",
      "The programme follows a gated review process — mission requirements, preliminary design review and critical design review — before manufacturing release. Each gate is chaired by the faculty advisor and attended by every division lead.",
      "Key risks identified at kick-off include composite manufacturing throughput and telemetry integration lead-time. Mitigations include early tooling trials and a bench avionics rig that runs in parallel with airframe build.",
    ],
    tags: ["AP-2", "Design review", "Composites"],
  },
  {
    slug: "ap-1-first-flight", title: "Phoenix Mk I completes first flight", date: "Pending confirmation", category: "Competition",
    excerpt: "The team's first aircraft flew a full test card, validating build quality, pilot procedures and the mass budget.",
    image: IMG.flight2, readMinutes: 3, author: "Flight Test & Operations",
    body: [
      "After a ground-test campaign covering static thrust, control-surface throws, radio range and taxi handling, Phoenix Mk I completed its first sortie. The flight followed a conservative test card: take-off, climb to a safe altitude, trim, gentle turns, approach to stall and landing.",
      "Data from the flight logs is being used to correct the aerodynamic model and to inform tail sizing on AP-2.",
    ],
    tags: ["AP-1", "Flight test"],
  },
  {
    slug: "press-kit", title: "Press kit and media resources", date: "Pending confirmation", category: "Press",
    excerpt: "Logos, approved photography, fact sheet and contact details for journalists and partners.",
    image: IMG.teamLaunch, readMinutes: 2, author: "Management",
    body: [
      "Media representatives can download the team's press kit from the Press section below. The kit includes logo files in SVG and PNG, a one-page fact sheet, approved photography and biographies of the leadership team.",
      "For interview requests please contact the team via the email address on the Contact page.",
    ],
    tags: ["Press", "Media"],
  },
];
