import { lazy } from "react";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "@/components/layout";
import Home from "@/pages/Home";
import { NotFound } from "@/pages/MiscPages";
import { isHashRouting } from "@/utils/url";

/* Route-level code splitting. (When bundled as a single file the chunks are inlined, but the boundaries remain.) */
const AircraftPage = lazy(() => import("@/pages/AircraftPage"));
const EngineeringIndex = lazy(() => import("@/pages/EngineeringPage").then((m) => ({ default: m.EngineeringIndex })));
const DivisionPage = lazy(() => import("@/pages/EngineeringPage").then((m) => ({ default: m.DivisionPage })));
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const TimelinePage = lazy(() => import("@/pages/TimelinePage"));
const SponsorsPage = lazy(() => import("@/pages/SponsorsPage"));
const NewsIndex = lazy(() => import("@/pages/NewsPage").then((m) => ({ default: m.NewsIndex })));
const ArticlePage = lazy(() => import("@/pages/NewsPage").then((m) => ({ default: m.ArticlePage })));
const GalleryPage = lazy(() => import("@/pages/MiscPages").then((m) => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import("@/pages/MiscPages").then((m) => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import("@/pages/MiscPages").then((m) => ({ default: m.PrivacyPage })));

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "aircraft", element: <AircraftPage /> },
      { path: "engineering", element: <EngineeringIndex /> },
      { path: "engineering/:id", element: <DivisionPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "team/:slug", element: <TeamPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "timeline", element: <TimelinePage /> },
      { path: "sponsors", element: <SponsorsPage /> },
      { path: "news", element: <NewsIndex /> },
      { path: "news/:slug", element: <ArticlePage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

/* Use hash routing when served from a static file (no server rewrites), otherwise clean URLs. */
const router = isHashRouting() ? createHashRouter(routes) : createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
