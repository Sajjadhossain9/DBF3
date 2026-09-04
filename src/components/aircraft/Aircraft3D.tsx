import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Hotspot } from "@/data/aircraft";

export type ViewName = "iso" | "side" | "top" | "front";
export interface SceneProps {
  view: ViewName; wireframe: boolean; autoRotate: boolean; resetSignal: number;
  hotspots: Hotspot[]; hotspotRefs: RefObject<Map<string, HTMLButtonElement>>; modelPath?: string;
  onModelStatus: (s: "demo" | "glb") => void; dark: boolean;
}

const VIEWS: Record<ViewName, { theta: number; phi: number; r: number }> = {
  iso: { theta: Math.PI * 0.8, phi: Math.PI * 0.36, r: 4.2 },
  side: { theta: Math.PI / 2, phi: Math.PI / 2, r: 4.0 },
  top: { theta: Math.PI, phi: 0.02, r: 4.2 },
  front: { theta: 0, phi: Math.PI / 2, r: 3.8 },
};

/* ---------- Procedural demonstration aircraft (NOT the team's real design) ---------- */
function DemoAircraft({ wireframe }: { wireframe: boolean }) {
  const body = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e8ecf3", roughness: 0.45, metalness: 0.1, wireframe }), [wireframe]);
  const accent = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ff7a1a", roughness: 0.5, wireframe }), [wireframe]);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1b2540", roughness: 0.6, wireframe }), [wireframe]);
  const wingGeo = useMemo(() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(2.3, -0.05); s.lineTo(2.3, -0.30); s.lineTo(0, -0.42); s.lineTo(0, 0); return new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false }); }, []);
  const prop = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (prop.current) prop.current.rotation.z += dt * 12; });
  return (
    <group>
      {/* fuselage */}
      <mesh material={body} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}><capsuleGeometry args={[0.16, 1.9, 8, 20]} /></mesh>
      {/* canopy */}
      <mesh material={dark} position={[0, 0.14, 0.55]} scale={[0.8, 0.6, 1.4]}><sphereGeometry args={[0.15, 16, 12]} /></mesh>
      {/* nose cone + spinner */}
      <mesh material={accent} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.18]}><coneGeometry args={[0.12, 0.2, 16]} /></mesh>
      <group ref={prop} position={[0, 0, 1.3]}><mesh material={dark}><boxGeometry args={[1.0, 0.06, 0.01]} /></mesh><mesh material={dark} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[1.0, 0.06, 0.01]} /></mesh></group>
      {/* wings (high wing) */}
      <mesh geometry={wingGeo} material={body} position={[0.1, 0.14, 0.15]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={wingGeo} material={body} position={[-0.1, 0.14, 0.15]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={[1, -1, 1]} />
      {/* wing tips accent */}
      <mesh material={accent} position={[2.3, 0.14, -0.02]}><boxGeometry args={[0.2, 0.06, 0.3]} /></mesh>
      <mesh material={accent} position={[-2.3, 0.14, -0.02]}><boxGeometry args={[0.2, 0.06, 0.3]} /></mesh>
      {/* tail boom & empennage */}
      <mesh material={body} position={[0, 0.02, -1.05]}><boxGeometry args={[1.2, 0.03, 0.32]} /></mesh>
      <mesh material={accent} position={[0, 0.22, -1.05]}><boxGeometry args={[0.03, 0.42, 0.34]} /></mesh>
      {/* landing gear */}
      {[[-0.35, -0.22, 0.25], [0.35, -0.22, 0.25], [0, -0.22, 0.95]].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <mesh material={dark}><boxGeometry args={[0.02, 0.2, 0.02]} /></mesh>
          <mesh material={dark} position={[0, -0.12, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.03, 16]} /></mesh>
        </group>
      ))}
      {/* payload bay marker */}
      <mesh material={accent} position={[0, -0.13, -0.05]}><boxGeometry args={[0.2, 0.06, 0.5]} /></mesh>
    </group>
  );
}

function GLBModel({ path, wireframe, onFail, onOk }: { path: string; wireframe: boolean; onFail: () => void; onOk: () => void }) {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  useEffect(() => {
    let alive = true;
    // Guard: HEAD request first so a 404 HTML page never gets parsed as GLB.
    fetch(path, { method: "HEAD" }).then((r) => {
      if (!r.ok || !/model|octet/.test(r.headers.get("content-type") ?? "")) throw new Error("no model");
      return new Promise<THREE.Group>((res, rej) => new GLTFLoader().load(path, (g) => res(g.scene), undefined, rej));
    }).then((s) => {
      if (!alive) return;
      const box = new THREE.Box3().setFromObject(s); const size = box.getSize(new THREE.Vector3()); const scale = 4.4 / Math.max(size.x, size.y, size.z);
      s.scale.setScalar(scale); box.setFromObject(s); s.position.sub(box.getCenter(new THREE.Vector3()));
      setScene(s); onOk();
    }).catch(() => alive && onFail());
    return () => { alive = false; };
  }, [path, onFail, onOk]);
  useEffect(() => { scene?.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { const mats = Array.isArray(m.material) ? m.material : [m.material]; mats.forEach((mat) => { (mat as THREE.MeshStandardMaterial).wireframe = wireframe; }); } }); }, [scene, wireframe]);
  return scene ? <primitive object={scene} /> : null;
}

/* ---------- Camera rig with drag / wheel / view presets ---------- */
function Rig({ view, autoRotate, resetSignal, hotspots, hotspotRefs }: Pick<SceneProps, "view" | "autoRotate" | "resetSignal" | "hotspots" | "hotspotRefs">) {
  const { camera, gl, size } = useThree();
  const target = useRef({ ...VIEWS.iso });
  const cur = useRef({ ...VIEWS.iso });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const idle = useRef(0);
  const v = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => { target.current = { ...VIEWS[view] }; }, [view, resetSignal]);

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); idle.current = 0; };
    const move = (e: PointerEvent) => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; drag.current = { x: e.clientX, y: e.clientY }; target.current.theta -= dx * 0.006; target.current.phi = Math.min(Math.PI - 0.15, Math.max(0.05, target.current.phi - dy * 0.006)); idle.current = 0; };
    const up = () => { drag.current = null; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); target.current.r = Math.min(8, Math.max(2.2, target.current.r + e.deltaY * 0.004)); };
    let pinch = 0;
    const tstart = (e: TouchEvent) => { if (e.touches.length === 2) pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); };
    const tmove = (e: TouchEvent) => { if (e.touches.length === 2 && pinch) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); target.current.r = Math.min(8, Math.max(2.2, target.current.r - (d - pinch) * 0.01)); pinch = d; } };
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false }); el.addEventListener("touchstart", tstart, { passive: true }); el.addEventListener("touchmove", tmove, { passive: true });
    return () => { el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); el.removeEventListener("wheel", wheel); el.removeEventListener("touchstart", tstart); el.removeEventListener("touchmove", tmove); };
  }, [gl]);

  useFrame((_, dt) => {
    idle.current += dt;
    if (autoRotate && !drag.current && idle.current > 2.5) target.current.theta += dt * 0.15;
    const c = cur.current, t = target.current, k = 1 - Math.pow(0.001, dt);
    c.theta += (t.theta - c.theta) * k; c.phi += (t.phi - c.phi) * k; c.r += (t.r - c.r) * k;
    camera.position.set(c.r * Math.sin(c.phi) * Math.sin(c.theta), c.r * Math.cos(c.phi), c.r * Math.sin(c.phi) * Math.cos(c.theta));
    camera.lookAt(0, 0, 0);
    // project hotspots to DOM
    const map = hotspotRefs.current; if (!map) return;
    for (const h of hotspots) {
      const el = map.get(h.id); if (!el) continue;
      v.set(h.pos[0], h.pos[1], h.pos[2]).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width, y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      el.style.opacity = v.z < 1 ? "1" : "0";
    }
  });
  return null;
}

function GroundGrid({ dark }: { dark: boolean }) {
  const grid = useMemo(() => { const g = new THREE.GridHelper(10, 20, dark ? "#34487a" : "#8ea0c9", dark ? "#172647" : "#dde4f2"); (g.material as THREE.Material).transparent = true; (g.material as THREE.Material).opacity = 0.5; return g; }, [dark]);
  return <primitive object={grid} position={[0, -0.45, 0]} />;
}

export default function Aircraft3D(props: SceneProps) {
  const { wireframe, modelPath, onModelStatus, dark } = props;
  const [useGlb, setUseGlb] = useState(!!modelPath);
  const [glbReady, setGlbReady] = useState(false);
  const onFail = useCallback(() => setUseGlb(false), []);
  const onOk = useCallback(() => setGlbReady(true), []);
  useEffect(() => { onModelStatus(useGlb && glbReady ? "glb" : "demo"); }, [useGlb, glbReady, onModelStatus]);
  return (
    <Canvas dpr={[1, 1.75]} camera={{ fov: 38, near: 0.1, far: 100, position: [3, 2, 3] }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ touchAction: "none" }} frameloop="always">
      <ambientLight intensity={dark ? 0.55 : 0.9} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} color="#fff4e6" />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#8ea0c9" />
      <pointLight position={[0, -2, 2]} intensity={0.6} color="#ff7a1a" />
      <group position={[0, 0.1, 0]}>
        {useGlb && modelPath ? <GLBModel path={modelPath} wireframe={wireframe} onFail={onFail} onOk={onOk} /> : <DemoAircraft wireframe={wireframe} />}
      </group>
      <GroundGrid dark={dark} />
      <Rig {...props} />
    </Canvas>
  );
}
