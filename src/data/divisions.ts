import { IMG } from "./media";

export interface Division {
  id: string;
  code: string;
  name: string;
  short: string;
  summary: string;
  responsibilities: string[];
  tools: string[];
  /** Indices into the development pipeline (see story stages 1-11). */
  stages: number[];
  connections: string[];
  image: number;
  color: string;
}

export const divisions: Division[] = [
  {
    id: "aerodynamics", code: "AERO", name: "Aerodynamics", short: "Aero",
    summary: "Defines the aircraft's lifting surfaces, airfoil selection, stability margins and mission-performance envelope.",
    responsibilities: ["Airfoil selection & wing planform", "Lift/drag polars & mission performance model", "Static & dynamic stability", "CFD validation of critical cases", "Control-surface sizing"],
    tools: ["XFLR5", "OpenVSP", "ANSYS Fluent", "MATLAB", "Python"],
    stages: [1, 2, 4, 10], connections: ["structures", "propulsion", "flight-test"], image: IMG.windTunnel, color: "#38bdf8",
  },
  {
    id: "structures", code: "STRC", name: "Structures", short: "Structures",
    summary: "Turns aerodynamic loads into a light, stiff airframe using composite and balsa-ply construction methods.",
    responsibilities: ["Load-path definition & V-n diagram", "Spar, rib and fuselage design", "FEA of wing-root and landing-gear loads", "Mass budget ownership", "Static load testing"],
    tools: ["SolidWorks", "ANSYS Mechanical", "Fusion 360", "Excel mass budget"],
    stages: [3, 5, 6, 9], connections: ["aerodynamics", "manufacturing", "payload"], image: IMG.handsBuild, color: "#a78bfa",
  },
  {
    id: "propulsion", code: "PROP", name: "Propulsion",
    short: "Propulsion",
    summary: "Matches motor, propeller, ESC and battery to mission thrust and endurance requirements.",
    responsibilities: ["Motor–propeller matching", "Static thrust testing", "Battery sizing & energy budget", "Thermal management", "Power-system safety"],
    tools: ["eCalc", "Thrust stand", "Power analyser", "Python"],
    stages: [2, 6, 9, 10], connections: ["aerodynamics", "avionics", "flight-test"], image: IMG.groundPrep, color: "#fb923c",
  },
  {
    id: "avionics", code: "AVNX", name: "Avionics & Controls", short: "Avionics",
    summary: "Integrates flight controller, telemetry, sensors, servo wiring and ground-station software.",
    responsibilities: ["Flight-controller configuration", "Servo & power harness design", "Telemetry link & ground station", "Sensor calibration", "Fail-safe logic"],
    tools: ["ArduPilot / PX4", "Mission Planner", "KiCad", "Oscilloscope", "C++"],
    stages: [8, 9, 10], connections: ["propulsion", "flight-test", "payload"], image: IMG.avionicsDesk, color: "#34d399",
  },
  {
    id: "manufacturing", code: "MFG", name: "Manufacturing", short: "Manufacturing",
    summary: "Builds the airframe: composite layups, laser-cut structures, 3D-printed fittings and final assembly.",
    responsibilities: ["Composite layup & vacuum bagging", "CNC / laser cutting of ribs", "3D-printed fittings & mounts", "Assembly jigs & alignment", "Quality control & weighing"],
    tools: ["Laser cutter", "FDM printers", "Vacuum pump", "Fusion 360 CAM"],
    stages: [6, 7, 9], connections: ["structures", "payload", "flight-test"], image: IMG.assembly, color: "#f472b6",
  },
  {
    id: "payload", code: "PYLD", name: "Payload Systems", short: "Payload",
    summary: "Designs the mission payload bay, release mechanisms and rapid-loading procedures required by the competition.",
    responsibilities: ["Payload bay geometry & CG control", "Release / retention mechanisms", "Loading-time procedures", "Mission-score modelling"],
    tools: ["SolidWorks", "3D printing", "Load cells"],
    stages: [1, 3, 7, 11], connections: ["structures", "manufacturing", "avionics"], image: IMG.pcbLaptop, color: "#facc15",
  },
  {
    id: "flight-test", code: "FLT", name: "Flight Test & Operations", short: "Flight Ops",
    summary: "Plans and executes ground and flight testing, pilot training, safety procedures and competition-day operations.",
    responsibilities: ["Test cards & safety checklists", "Pilot & crew coordination", "Flight-log analysis", "Field maintenance", "Competition operations"],
    tools: ["Flight logs", "Telemetry review", "Checklists", "Field kit"],
    stages: [9, 10, 11], connections: ["aerodynamics", "propulsion", "avionics", "management"], image: IMG.flight1, color: "#ff7a1a",
  },
  {
    id: "management", code: "MGMT", name: "Management & Sponsorship", short: "Management",
    summary: "Owns schedule, budget, documentation, sponsor relations, media and the design-report submission.",
    responsibilities: ["Project schedule & risk register", "Budget & procurement", "Design report & presentations", "Sponsor relations", "Media & outreach"],
    tools: ["Notion", "Google Workspace", "Figma", "LaTeX"],
    stages: [1, 2, 11], connections: ["flight-test", "payload"], image: IMG.teamLaunch, color: "#94a3b8",
  },
];

export const divisionById = (id: string) => divisions.find((d) => d.id === id);
