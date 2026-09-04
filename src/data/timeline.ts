export type EventCategory = "Formation" | "Development" | "Design Review" | "Manufacturing" | "Ground Test" | "Flight Test" | "Competition" | "Recognition" | "Media" | "Future";

export interface TimelineEvent {
  id: string;
  year: number;
  /** ISO date when verified; null = pending team confirmation */
  date: string | null;
  title: string;
  category: EventCategory;
  body: string;
  verified: boolean;
  link?: string;
}

export const timeline: TimelineEvent[] = [
  { id: "t1", year: 2024, date: null, title: "Airborne Phoenix founded at AAUB", category: "Formation", body: "Student team established under the Design • Build • Fly banner with faculty supervision.", verified: false },
  { id: "t2", year: 2024, date: null, title: "AP-1 Phoenix Mk I concept freeze", category: "Development", body: "Conventional high-wing trainer selected to validate workflow and pilot training.", verified: false, link: "/aircraft?a=ap-1" },
  { id: "t3", year: 2024, date: null, title: "AP-1 airframe complete", category: "Manufacturing", body: "Balsa/ply airframe finished and covered; mass budget recorded.", verified: false },
  { id: "t4", year: 2025, date: null, title: "AP-1 ground test campaign", category: "Ground Test", body: "Static thrust, range check and taxi tests passed.", verified: false },
  { id: "t5", year: 2025, date: null, title: "AP-1 first flight", category: "Flight Test", body: "Successful first flight; trim and stall behaviour logged.", verified: false, link: "/aircraft?a=ap-1" },
  { id: "t6", year: 2025, date: null, title: "AP-2 mission requirements review", category: "Design Review", body: "Competition rules decomposed into requirements; scoring sensitivity study completed.", verified: false },
  { id: "t7", year: 2025, date: null, title: "AP-2 preliminary design review", category: "Design Review", body: "Configuration and mass budget baselined with faculty advisor.", verified: false },
  { id: "t8", year: 2025, date: null, title: "University recognition", category: "Recognition", body: "Team featured by the university for student innovation. Details pending confirmation.", verified: false },
  { id: "t9", year: 2025, date: null, title: "Media publication", category: "Media", body: "Coverage of the team's programme. Publication details pending confirmation.", verified: false },
  { id: "t10", year: 2026, date: null, title: "AP-2 critical design review", category: "Design Review", body: "Detailed design release for manufacturing.", verified: false },
  { id: "t11", year: 2026, date: null, title: "AP-2 manufacturing", category: "Manufacturing", body: "Composite wing layup and fuselage assembly.", verified: false },
  { id: "t12", year: 2026, date: null, title: "AP-2 flight-test campaign", category: "Flight Test", body: "Incremental envelope expansion with payload.", verified: false },
  { id: "t13", year: 2026, date: null, title: "Competition participation", category: "Competition", body: "Target: international Design • Build • Fly competition. Registration status pending confirmation.", verified: false },
  { id: "t14", year: 2027, date: null, title: "Future mission: AP-3", category: "Future", body: "Next-generation aircraft study — planned.", verified: false },
];
