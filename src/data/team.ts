/**
 * Team roster. NOTE: names below are PLACEHOLDERS pending official roster confirmation.
 * Set `rosterVerified` to true once the list has been checked by the team lead.
 * Portraits: /public/images/team/<slug>.webp, 800×1000 (4:5), < 200 KB.
 */
export const rosterVerified = false;

export type Tier = "advisor" | "lead" | "co-lead" | "chief" | "dept-lead" | "member";

export interface Member {
  slug: string;
  name: string;
  role: string;
  tier: Tier;
  division: string;          // division id
  season: string;            // e.g. "2025-26"
  skills?: string[];
  linkedin?: string;
  contribution?: string;
  portrait?: string;         // path under /images/team
}

export const seasons = ["2025-26", "2024-25"];

export const team: Member[] = [
  { slug: "faculty-advisor", name: "Faculty Advisor (name pending)", role: "Faculty Advisor", tier: "advisor", division: "management", season: "2025-26", skills: ["Aerospace Engineering", "Flight Mechanics"], contribution: "Academic supervision, design review sign-off and university liaison." },
  { slug: "team-lead", name: "Team Lead (name pending)", role: "Team Lead", tier: "lead", division: "management", season: "2025-26", skills: ["Project Management", "Systems Engineering"], contribution: "Overall programme direction, competition registration and sponsor relations." },
  { slug: "co-lead", name: "Co-Lead (name pending)", role: "Co-Lead", tier: "co-lead", division: "flight-test", season: "2025-26", skills: ["Flight Operations", "Safety"], contribution: "Flight-test campaign lead and operations planning." },
  { slug: "chief-engineer", name: "Chief Engineer (name pending)", role: "Chief Engineer", tier: "chief", division: "aerodynamics", season: "2025-26", skills: ["Aircraft Design", "CFD", "Trade Studies"], contribution: "Configuration selection and technical integration across divisions." },
  { slug: "aero-lead", name: "Aerodynamics Lead (pending)", role: "Aerodynamics Lead", tier: "dept-lead", division: "aerodynamics", season: "2025-26", skills: ["XFLR5", "OpenVSP", "Fluent"] },
  { slug: "structures-lead", name: "Structures Lead (pending)", role: "Structures Lead", tier: "dept-lead", division: "structures", season: "2025-26", skills: ["FEA", "Composites", "SolidWorks"] },
  { slug: "propulsion-lead", name: "Propulsion Lead (pending)", role: "Propulsion Lead", tier: "dept-lead", division: "propulsion", season: "2025-26", skills: ["Motor Matching", "Thrust Testing"] },
  { slug: "avionics-lead", name: "Avionics Lead (pending)", role: "Avionics & Controls Lead", tier: "dept-lead", division: "avionics", season: "2025-26", skills: ["ArduPilot", "PCB Design", "Embedded C++"] },
  { slug: "manufacturing-lead", name: "Manufacturing Lead (pending)", role: "Manufacturing Lead", tier: "dept-lead", division: "manufacturing", season: "2025-26", skills: ["Composite Layup", "CNC", "3D Printing"] },
  { slug: "payload-lead", name: "Payload Lead (pending)", role: "Payload Systems Lead", tier: "dept-lead", division: "payload", season: "2025-26", skills: ["Mechanism Design", "CG Management"] },
  { slug: "member-01", name: "Team Member 01", role: "Aerodynamics Engineer", tier: "member", division: "aerodynamics", season: "2025-26", skills: ["XFLR5", "Python"] },
  { slug: "member-02", name: "Team Member 02", role: "Structures Engineer", tier: "member", division: "structures", season: "2025-26", skills: ["ANSYS", "Fusion 360"] },
  { slug: "member-03", name: "Team Member 03", role: "Structures Engineer", tier: "member", division: "structures", season: "2025-26" },
  { slug: "member-04", name: "Team Member 04", role: "Propulsion Engineer", tier: "member", division: "propulsion", season: "2025-26", skills: ["eCalc", "Battery Systems"] },
  { slug: "member-05", name: "Team Member 05", role: "Avionics Engineer", tier: "member", division: "avionics", season: "2025-26", skills: ["Mission Planner", "Soldering"] },
  { slug: "member-06", name: "Team Member 06", role: "Avionics Engineer", tier: "member", division: "avionics", season: "2025-26" },
  { slug: "member-07", name: "Team Member 07", role: "Manufacturing Engineer", tier: "member", division: "manufacturing", season: "2025-26", skills: ["Laser Cutting", "Vacuum Bagging"] },
  { slug: "member-08", name: "Team Member 08", role: "Manufacturing Engineer", tier: "member", division: "manufacturing", season: "2025-26" },
  { slug: "member-09", name: "Team Member 09", role: "Payload Engineer", tier: "member", division: "payload", season: "2025-26" },
  { slug: "member-10", name: "Team Member 10", role: "Flight Test Engineer", tier: "member", division: "flight-test", season: "2025-26", skills: ["Telemetry Analysis"] },
  { slug: "member-11", name: "Team Member 11", role: "Pilot", tier: "member", division: "flight-test", season: "2025-26", skills: ["RC Piloting"] },
  { slug: "member-12", name: "Team Member 12", role: "Sponsorship Coordinator", tier: "member", division: "management", season: "2025-26" },
  { slug: "member-13", name: "Team Member 13", role: "Media & Documentation", tier: "member", division: "management", season: "2025-26", skills: ["Video", "Design"] },
  // Archive — previous season
  { slug: "archive-lead-2024", name: "Founding Team Lead (pending)", role: "Team Lead", tier: "lead", division: "management", season: "2024-25", contribution: "Founded the team and delivered the first prototype programme." },
  { slug: "archive-chief-2024", name: "Founding Chief Engineer (pending)", role: "Chief Engineer", tier: "chief", division: "aerodynamics", season: "2024-25" },
  { slug: "archive-member-2024-a", name: "Founding Member A", role: "Structures", tier: "member", division: "structures", season: "2024-25" },
  { slug: "archive-member-2024-b", name: "Founding Member B", role: "Avionics", tier: "member", division: "avionics", season: "2024-25" },
];

export const tierLabel: Record<Tier, string> = {
  advisor: "Faculty Advisor", lead: "Team Lead", "co-lead": "Co-Lead", chief: "Chief Engineer", "dept-lead": "Department Lead", member: "Member",
};
export const tierOrder: Tier[] = ["advisor", "lead", "co-lead", "chief", "dept-lead", "member"];
