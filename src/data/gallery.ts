import { IMG } from "./media";

export const galleryCategories = ["All", "Aircraft", "Design", "Simulation", "Manufacturing", "Avionics", "Ground Test", "Flight Test", "Competition", "Team", "Media Coverage"] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  pexelsId?: number;      // placeholder source; replace with `src`
  src?: string;           // local path e.g. /images/gallery/xyz.webp
  poster?: string;
  category: Exclude<GalleryCategory, "All">;
  caption: string;
  date: string;           // ISO or "Pending confirmation"
  w: number; h: number;   // intrinsic aspect for layout stability
  downloadable: boolean;
  credit?: string;
}

export const gallery: GalleryItem[] = [
  { id: "g1", type: "image", pexelsId: IMG.flight2, category: "Flight Test", caption: "Envelope-expansion sortie — trim and stall characterisation.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g2", type: "image", pexelsId: IMG.assembly, category: "Manufacturing", caption: "Airframe assembly on the alignment jig.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g3", type: "image", pexelsId: IMG.avionicsDesk, category: "Avionics", caption: "Avionics tray integration and harness routing.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g4", type: "image", pexelsId: IMG.launch, category: "Aircraft", caption: "Pre-flight line-up on the grass strip.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g5", type: "image", pexelsId: IMG.windTunnel, category: "Simulation", caption: "Flow visualisation study supporting CFD validation.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g6", type: "image", pexelsId: IMG.groundPrep, category: "Ground Test", caption: "Control-surface throw check before taxi test.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g7", type: "image", pexelsId: IMG.onGrass, category: "Competition", caption: "Aircraft staged for technical inspection.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g8", type: "image", pexelsId: IMG.teamLaunch, category: "Team", caption: "Flight crew preparing for a hand launch.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g9", type: "image", pexelsId: IMG.pcbLaptop, category: "Design", caption: "Systems layout review against the CAD master model.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g10", type: "image", pexelsId: IMG.soldering, category: "Avionics", caption: "Power distribution board soldering.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g11", type: "image", pexelsId: IMG.handsBuild, category: "Manufacturing", caption: "Fitting installation on the fuselage bulkhead.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g12", type: "image", pexelsId: IMG.runwayJet, category: "Competition", caption: "Take-off roll during a scored mission.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g13", type: "image", pexelsId: IMG.flight1, category: "Flight Test", caption: "Low pass for pilot familiarisation.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g14", type: "image", pexelsId: IMG.wiring, category: "Manufacturing", caption: "Servo harness preparation.", date: "Pending confirmation", w: 3, h: 2, downloadable: false, credit: "Placeholder · Pexels" },
  { id: "g15", type: "video", src: "https://videos.pexels.com/video-files/6216472/6216472-hd_1920_1080_30fps.mp4", poster: "https://images.pexels.com/videos/6216472/air-travel-airplane-window-clouds-flight-6216472.jpeg?auto=compress&cs=tinysrgb&w=1200", category: "Media Coverage", caption: "Atmospheric b-roll used in the season teaser (placeholder footage).", date: "Pending confirmation", w: 16, h: 9, downloadable: false, credit: "Placeholder · Pexels" },
];
