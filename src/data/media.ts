/**
 * Media helpers. Team-owned assets live in /public/images, /public/videos, /public/models.
 * Until real assets are uploaded, editorial placeholders come from Pexels (free licence).
 * Replace `px(...)` calls with local paths such as "/images/aircraft/ap-2-side.webp".
 */
export const px = (id: number, w = 1200, h?: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}&fit=crop` : ""}`;

export const pxSet = (id: number) => ({
  src: px(id, 1200),
  srcSet: `${px(id, 480)} 480w, ${px(id, 800)} 800w, ${px(id, 1200)} 1200w, ${px(id, 1600)} 1600w`,
  blur: px(id, 24),
});

export const HERO_VIDEO = {
  mp4: "/videos/airborne-phoenix-hero.mp4",
  webm: "/videos/airborne-phoenix-hero.webm",
  mobile: "/videos/airborne-phoenix-mobile.mp4",
  poster: "/images/hero-poster.webp",
  /** Atmospheric stock fallback (sky only — not a depiction of team aircraft). */
  fallback: "https://videos.pexels.com/video-files/6216472/6216472-hd_1920_1080_30fps.mp4",
  fallbackPoster: "https://images.pexels.com/videos/6216472/air-travel-airplane-window-clouds-flight-6216472.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

export const IMG = {
  flight1: 38660827,
  flight2: 38544853,
  launch: 8244920,
  onGrass: 8310149,
  groundPrep: 8310154,
  runwayJet: 8244986,
  teamLaunch: 11917454,
  avionicsDesk: 19895722,
  pcbLaptop: 19895780,
  assembly: 19895719,
  soldering: 19895844,
  windTunnel: 5265274,
  wiring: 5265276,
  handsBuild: 7868884,
};
