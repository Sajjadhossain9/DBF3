import { IMG } from "./media";

/**
 * Aircraft data. Specifications are only rendered when `status` is "verified".
 * "target" values are shown with a DESIGN TARGET badge; `null` renders "Specification pending team verification".
 */
export type SpecStatus = "verified" | "target";
export interface Spec { value: string; status: SpecStatus }
export interface SpecSet {
  wingspan: Spec | null; length: Spec | null; weight: Spec | null; payload: Spec | null;
  propulsion: Spec | null; endurance: Spec | null; material: Spec | null; competitionYear: Spec | null;
}
export interface TestRecord { date: string | null; type: string; result: "pass" | "partial" | "planned"; note: string }
export interface Aircraft {
  id: string; name: string; designation: string; generation: number; year: string;
  status: "concept" | "in-development" | "flight-tested" | "retired";
  summary: string; mission: string[]; specs: SpecSet; tests: TestRecord[];
  divisions: string[]; images: number[]; hero: number;
  timeline: { label: string; date: string | null }[];
  modelPath?: string; technicalSummary?: string;
}

export const aircraft: Aircraft[] = [
  {
    id: "ap-1", name: "Phoenix Mk I", designation: "AP-1", generation: 1, year: "2024–25", status: "flight-tested",
    summary: "First-generation proof-of-concept trainer. A conventional high-wing, tractor-propeller layout chosen to validate build methods, flight-test procedures and the team's design workflow.",
    mission: ["Validate design–build–fly workflow", "Train pilots and ground crew", "Baseline handling and stall behaviour", "Establish mass-budget discipline"],
    specs: {
      wingspan: { value: "1.8 m", status: "target" }, length: null, weight: null, payload: null,
      propulsion: { value: "Single brushless electric, tractor", status: "verified" }, endurance: null,
      material: { value: "Balsa / plywood, film covering", status: "verified" }, competitionYear: null,
    },
    tests: [
      { date: null, type: "Static thrust test", result: "pass", note: "Motor–propeller combination validated on thrust stand." },
      { date: null, type: "Taxi test", result: "pass", note: "Ground handling and tracking acceptable." },
      { date: null, type: "First flight", result: "pass", note: "Trim and stall behaviour recorded." },
    ],
    divisions: ["aerodynamics", "structures", "propulsion", "manufacturing", "flight-test"],
    images: [IMG.groundPrep, IMG.launch, IMG.flight2], hero: IMG.flight2,
    timeline: [{ label: "Concept freeze", date: null }, { label: "Airframe complete", date: null }, { label: "First flight", date: null }],
  },
  {
    id: "ap-2", name: "Phoenix Mk II", designation: "AP-2", generation: 2, year: "2025–26", status: "in-development",
    summary: "Second-generation competition aircraft. Optimised for a payload-carrying mission profile with a rapid-loading payload bay, composite wing structure and full telemetry avionics.",
    mission: ["Maximise mission score under competition rules", "Carry modular payload with fast turnaround", "Repeatable, safe field operations", "Full telemetry for post-flight analysis"],
    specs: {
      wingspan: { value: "2.2 m", status: "target" }, length: { value: "1.5 m", status: "target" }, weight: null,
      payload: { value: "Modular payload bay", status: "target" },
      propulsion: { value: "Single brushless electric, LiPo", status: "target" }, endurance: null,
      material: { value: "Carbon/glass composite wing, laser-cut ply fuselage", status: "target" },
      competitionYear: { value: "2026", status: "target" },
    },
    tests: [
      { date: null, type: "Wing static load test", result: "planned", note: "Wing-root bending to limit load." },
      { date: null, type: "Avionics bench test", result: "planned", note: "Fail-safe and telemetry range check." },
      { date: null, type: "First flight", result: "planned", note: "Scheduled after ground-test sign-off." },
    ],
    divisions: ["aerodynamics", "structures", "propulsion", "avionics", "manufacturing", "payload", "flight-test", "management"],
    images: [IMG.assembly, IMG.avionicsDesk, IMG.runwayJet], hero: IMG.launch,
    timeline: [{ label: "Mission requirements", date: null }, { label: "PDR", date: null }, { label: "CDR", date: null }, { label: "Manufacturing", date: null }, { label: "First flight", date: null }, { label: "Competition", date: null }],
    modelPath: "/models/airborne-phoenix-aircraft.glb",
  },
];

export const specMeta: { key: keyof SpecSet; label: string; unitHint: string }[] = [
  { key: "wingspan", label: "Wingspan", unitHint: "m" },
  { key: "length", label: "Length", unitHint: "m" },
  { key: "weight", label: "Empty weight", unitHint: "kg" },
  { key: "payload", label: "Payload", unitHint: "kg" },
  { key: "propulsion", label: "Propulsion", unitHint: "" },
  { key: "endurance", label: "Flight endurance", unitHint: "min" },
  { key: "material", label: "Material", unitHint: "" },
  { key: "competitionYear", label: "Competition year", unitHint: "" },
];

/* ---------- Hotspots for the 3D / 2D viewer ---------- */
export interface Hotspot { id: string; label: string; pos: [number, number, number]; pos2d: [number, number]; title: string; body: string; division: string }
export const hotspots: Hotspot[] = [
  { id: "wing", label: "Wing", pos: [1.1, 0.12, -0.1], pos2d: [72, 46], title: "Composite wing", body: "High-aspect-ratio wing with carbon spar caps and glass skin. Airfoil selected for high CL-max at low Reynolds number; flaps sized for short field take-off.", division: "aerodynamics" },
  { id: "fuselage", label: "Fuselage", pos: [0, 0.05, 0.3], pos2d: [50, 40], title: "Fuselage & payload bay", body: "Laser-cut ply semi-monocoque with a removable payload bay and quick-release hatch. Bulkhead spacing driven by landing loads.", division: "structures" },
  { id: "propulsion", label: "Propulsion", pos: [0, 0.05, 1.05], pos2d: [50, 12], title: "Electric propulsion", body: "Brushless outrunner with folding-free fixed propeller; sized via static thrust tests. Battery bay positioned for CG trimming.", division: "propulsion" },
  { id: "avionics", label: "Avionics", pos: [0, 0.18, 0.55], pos2d: [50, 24], title: "Avionics bay", body: "Flight controller, GPS, airspeed sensor and telemetry radio on a vibration-isolated tray, accessible through the canopy.", division: "avionics" },
  { id: "gear", label: "Landing gear", pos: [0, -0.3, 0.35], pos2d: [44, 58], title: "Landing gear", body: "Tricycle configuration with composite main legs and steerable nose gear for reliable ground handling on grass strips.", division: "structures" },
  { id: "payload", label: "Payload area", pos: [0, -0.08, -0.05], pos2d: [50, 66], title: "Payload area", body: "Modular payload cradle with retention latches designed for a sub-minute loading procedure while keeping CG within limits.", division: "payload" },
];

/* ---------- Mission-to-flight story stages ---------- */
export interface Stage { n: number; title: string; body: string; division: string; tool: string; image: number; link: string; drawing: "mission" | "concept" | "cad" | "cfd" | "fea" | "material" | "mfg" | "avionics" | "ground" | "flight" | "comp" }
export const stages: Stage[] = [
  { n: 1, title: "Mission requirements", body: "Competition rules are decomposed into measurable requirements: payload, field length, timing, safety and scoring sensitivity.", division: "management", tool: "Requirements matrix", image: IMG.teamLaunch, link: "/engineering/management", drawing: "mission" },
  { n: 2, title: "Concept selection", body: "Configuration trade studies weigh mission score against build risk. A weighted decision matrix selects the baseline layout.", division: "aerodynamics", tool: "OpenVSP • Decision matrix", image: IMG.onGrass, link: "/engineering/aerodynamics", drawing: "concept" },
  { n: 3, title: "CAD development", body: "A parametric master model defines the outer mould line, structural layout, systems routing and CG envelope.", division: "structures", tool: "SolidWorks • Fusion 360", image: IMG.pcbLaptop, link: "/engineering/structures", drawing: "cad" },
  { n: 4, title: "CFD simulation", body: "Critical flight conditions are simulated to check lift distribution, stall progression and tail effectiveness.", division: "aerodynamics", tool: "ANSYS Fluent • XFLR5", image: IMG.windTunnel, link: "/engineering/aerodynamics", drawing: "cfd" },
  { n: 5, title: "Structural analysis", body: "Wing-root bending, landing impact and payload loads are analysed to size spars, ribs and fittings with margin.", division: "structures", tool: "ANSYS Mechanical", image: IMG.handsBuild, link: "/engineering/structures", drawing: "fea" },
  { n: 6, title: "Material selection", body: "Carbon, glass, balsa and ply are compared on stiffness-to-weight, cost, availability and manufacturability.", division: "manufacturing", tool: "Material trade study", image: IMG.wiring, link: "/engineering/manufacturing", drawing: "material" },
  { n: 7, title: "Manufacturing", body: "Composite layups, laser-cut structures and printed fittings come together on alignment jigs.", division: "manufacturing", tool: "Laser cutter • Vacuum bagging", image: IMG.assembly, link: "/engineering/manufacturing", drawing: "mfg" },
  { n: 8, title: "Avionics integration", body: "Flight controller, telemetry, servos and power harness are installed, calibrated and fail-safe tested.", division: "avionics", tool: "ArduPilot • Mission Planner", image: IMG.avionicsDesk, link: "/engineering/avionics", drawing: "avionics" },
  { n: 9, title: "Ground testing", body: "Static load, thrust, range and taxi tests confirm the aircraft is safe to fly before the first sortie.", division: "flight-test", tool: "Thrust stand • Test cards", image: IMG.groundPrep, link: "/engineering/flight-test", drawing: "ground" },
  { n: 10, title: "Flight testing", body: "An incremental envelope-expansion campaign records trim, stall, climb and payload handling.", division: "flight-test", tool: "Telemetry logs", image: IMG.flight1, link: "/engineering/flight-test", drawing: "flight" },
  { n: 11, title: "Competition", body: "Technical inspection, design presentation and scored flight missions — the culmination of the season.", division: "management", tool: "Design report • Operations plan", image: IMG.runwayJet, link: "/timeline", drawing: "comp" },
];
