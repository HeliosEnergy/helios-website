import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import mapData from "./us-map-data.json";
import { STATUS_META, type Site } from "./sites";

/* Albers 975x610 -> world space centered on the contiguous US */
const [MIN_X, MIN_Y, MAX_X, MAX_Y] = mapData.bbox;
const CX = (MIN_X + MAX_X) / 2;
const CY = (MIN_Y + MAX_Y) / 2;
const W = MAX_X - MIN_X;
const H = MAX_Y - MIN_Y;
const FOV = 30;
const HALF_FOV_TAN = Math.tan((FOV * Math.PI) / 360);
const BASE_TILT = -0.16;

const toWorld = (x: number, y: number): [number, number] => [x - CX, CY - y];

interface SceneProps {
  sites: Site[];
  variant: "home" | "colo";
  activeId: string | null;
  onActive: (id: string | null) => void;
  play: boolean;
  reduced: boolean;
}

/* ------------------------------------------------------------------ */
/* Camera fit + pointer parallax                                       */
/* ------------------------------------------------------------------ */

const Rig = ({ children, reduced }: { children: React.ReactNode; reduced: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const z = Math.max(
      (H / 2) * 1.14 / HALF_FOV_TAN,
      (W / 2) * 1.08 / (HALF_FOV_TAN * aspect),
    );
    camera.position.set(0, 0, z);
    camera.lookAt(0, 0, 0);
  }, [camera, size]);

  useFrame((state) => {
    if (!group.current) return;
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      BASE_TILT + py * 0.045,
      0.06,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      px * 0.07,
      0.06,
    );
  });

  return (
    <group ref={group} rotation={[BASE_TILT, 0, 0]}>
      {children}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* The dot continent                                                   */
/* ------------------------------------------------------------------ */

const DOT_VERT = /* glsl */ `
  attribute float aRand;
  attribute float aNorm;
  attribute float aGlow;
  uniform float uTime;
  uniform float uReveal;
  uniform float uScale;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float gate = aNorm * 0.85 + aRand * 0.15;
    vAlpha = smoothstep(gate, gate + 0.09, uReveal);
    float breath = 1.0 + 0.09 * sin(uTime * 0.7 + aRand * 6.2831);
    vGlow = aGlow * (0.72 + 0.28 * sin(uTime * 1.4 + aRand * 6.2831));
    float size = 2.6 * (1.0 + aGlow * 1.05) * breath;
    gl_PointSize = max(size * uScale / -mv.z, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const DOT_FRAG = /* glsl */ `
  varying float vAlpha;
  varying float vGlow;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float disc = 1.0 - smoothstep(0.3, 0.5, length(c));
    if (disc < 0.01) discard;
    vec3 col = mix(vec3(0.6, 0.63, 0.67), vec3(1.0, 0.57, 0.3), vGlow);
    gl_FragColor = vec4(col, vAlpha * disc * (0.3 + 0.62 * vGlow));
  }
`;

const DotField = ({
  sites,
  revealRef,
  reduced,
}: {
  sites: Site[];
  revealRef: React.MutableRefObject<number>;
  reduced: boolean;
}) => {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const raw = mapData.dots;
    const n = raw.length / 2;
    const positions = new Float32Array(n * 3);
    const aRand = new Float32Array(n);
    const aNorm = new Float32Array(n);
    const aGlow = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = raw[i * 2];
      const y = raw[i * 2 + 1];
      const [wx, wy] = toWorld(x, y);
      positions[i * 3] = wx;
      positions[i * 3 + 1] = wy;
      positions[i * 3 + 2] = 0;
      const s = Math.sin(i * 12.9898) * 43758.5453;
      aRand[i] = s - Math.floor(s);
      aNorm[i] = (x - MIN_X) / W;
      let glow = 0;
      for (const site of sites) {
        const d = Math.hypot(x - site.x, y - site.y);
        glow = Math.max(glow, 1 - d / 105);
      }
      aGlow[i] = glow * glow;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    geo.setAttribute("aNorm", new THREE.BufferAttribute(aNorm, 1));
    geo.setAttribute("aGlow", new THREE.BufferAttribute(aGlow, 1));
    return geo;
  }, [sites]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uScale: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    mat.current.uniforms.uReveal.value = revealRef.current;
    mat.current.uniforms.uScale.value =
      (state.size.height * state.viewport.dpr) / (2 * HALF_FOV_TAN);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={mat}
        vertexShader={DOT_VERT}
        fragmentShader={DOT_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* ------------------------------------------------------------------ */
/* Fiber-route arcs between sites                                      */
/* ------------------------------------------------------------------ */

const ARC_VERT = /* glsl */ `
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ARC_FRAG = /* glsl */ `
  uniform float uFlow;
  uniform float uAlpha;
  varying float vT;
  void main() {
    float endFade = smoothstep(0.0, 0.08, fract(vT)) * smoothstep(1.0, 0.92, fract(vT));
    float p = fract(vT - uFlow);
    float pulse = smoothstep(0.1, 0.0, min(p, 1.0 - p));
    vec3 col = mix(vec3(1.0), vec3(1.0, 0.57, 0.3), pulse);
    gl_FragColor = vec4(col, (0.10 + 0.5 * pulse) * endFade * uAlpha);
  }
`;

const ARC_PAIRS: Record<"home" | "colo", [string, string][]> = {
  home: [
    ["utah", "northCarolina"],
    ["northCarolina", "florida"],
  ],
  colo: [
    ["utah", "northCarolina"],
    ["northCarolina", "florida"],
    ["utah", "texas"],
    ["northCarolina", "kentucky"],
  ],
};

const Arcs = ({
  sites,
  variant,
  revealRef,
  reduced,
}: {
  sites: Site[];
  variant: "home" | "colo";
  revealRef: React.MutableRefObject<number>;
  reduced: boolean;
}) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ARC_VERT,
        fragmentShader: ARC_FRAG,
        uniforms: { uFlow: { value: 0.3 }, uAlpha: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const group = useMemo(() => {
    const g = new THREE.Group();
    const byId = new Map(sites.map((s) => [s.id as string, s]));
    ARC_PAIRS[variant].forEach(([a, b], idx) => {
      const sa = byId.get(a);
      const sb = byId.get(b);
      if (!sa || !sb) return;
      const [ax, ay] = toWorld(sa.x, sa.y);
      const [bx, by] = toWorld(sb.x, sb.y);
      const dist = Math.hypot(bx - ax, by - ay);
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(ax, ay, 2),
        new THREE.Vector3((ax + bx) / 2, (ay + by) / 2, 22 + dist * 0.16),
        new THREE.Vector3(bx, by, 2),
      );
      const pts = curve.getPoints(72);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const aT = new Float32Array(pts.length);
      for (let i = 0; i < pts.length; i++) {
        aT[i] = i / (pts.length - 1) + idx * 0.37;
      }
      geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
      g.add(new THREE.Line(geo, material));
    });
    return g;
  }, [sites, variant, material]);

  useFrame((state, delta) => {
    material.uniforms.uAlpha.value = Math.max(0, (revealRef.current - 0.8) / 0.2);
    if (!reduced) material.uniforms.uFlow.value += delta * 0.12;
  });

  return <primitive object={group} />;
};

/* ------------------------------------------------------------------ */
/* Site markers (DOM, projected through the camera)                    */
/* ------------------------------------------------------------------ */

const MarkerTooltip = ({
  site,
  variant,
  below,
  align,
}: {
  site: Site;
  variant: "home" | "colo";
  below: boolean;
  align: "center" | "right";
}) => {
  const meta = STATUS_META[site.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: below ? -6 : 6, x: align === "center" ? "-50%" : 0 }}
      animate={{ opacity: 1, y: 0, x: align === "center" ? "-50%" : 0 }}
      exit={{ opacity: 0, y: below ? -4 : 4, x: align === "center" ? "-50%" : 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${below ? "top-full mt-4" : "bottom-full mb-4"} ${
        align === "center" ? "left-1/2" : "right-0"
      } w-60 border border-white/10 bg-black/85 backdrop-blur-md p-4 text-left`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
        <span className="font-mono text-xs text-white/60">{site.statusLabel}</span>
      </div>
      <p className="mt-2 font-heading font-bold text-white text-lg leading-tight tracking-tight">
        {site.name}
      </p>
      <p className="mt-0.5 text-sm text-white/50">{site.metro}</p>
      {variant === "colo" && (
        <dl className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
          {(
            [
              ["Capacity", site.capacity],
              ["Cooling", site.cooling],
              ["Power", site.power],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3">
              <dt className="font-mono text-xs text-white/45">{k}</dt>
              <dd className="text-sm text-white/85 text-right">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </motion.div>
  );
};

const Markers = ({
  sites,
  variant,
  activeId,
  onActive,
  markersOn,
}: {
  sites: Site[];
  variant: "home" | "colo";
  activeId: string | null;
  onActive: (id: string | null) => void;
  markersOn: boolean;
}) => (
  <>
    {sites.map((site, i) => {
      const [wx, wy] = toWorld(site.x, site.y);
      const active = activeId === site.id;
      const below = site.y < CY;
      const align = site.x > 700 ? ("right" as const) : ("center" as const);
      const solid = site.status !== "reserving";
      return (
        <group key={site.id} position={[wx, wy, 4]}>
          <Html center zIndexRange={[40, 0]} style={{ pointerEvents: "none" }}>
            <div
              className={`pointer-events-auto transition-all duration-700 ease-out ${
                markersOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <button
                type="button"
                aria-label={`${site.name} — ${site.statusLabel}`}
                onMouseEnter={() => onActive(site.id)}
                onMouseLeave={() => onActive(null)}
                onFocus={() => onActive(site.id)}
                onBlur={() => onActive(null)}
                onClick={() => onActive(active ? null : site.id)}
                className="relative flex items-center justify-center w-7 h-7 cursor-pointer"
              >
                <span
                  className="map-ping absolute inset-0 rounded-full"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
                <span
                  className={`relative rounded-full w-[9px] h-[9px] transition-transform duration-300 ${
                    solid
                      ? "bg-primary shadow-[0_0_14px_2px_hsl(24_100%_64%/0.45)]"
                      : "border-[1.5px] border-primary bg-black"
                  } ${active ? "scale-150" : ""}`}
                />
                <span
                  className={`hidden sm:block absolute top-full left-1/2 -translate-x-1/2 mt-1 font-mono text-xs whitespace-nowrap transition-all duration-300 ${
                    active && below ? "opacity-0" : active ? "text-white" : "text-white/60"
                  }`}
                >
                  {site.name}
                </span>
                <AnimatePresence>
                  {active && (
                    <MarkerTooltip site={site} variant={variant} below={below} align={align} />
                  )}
                </AnimatePresence>
              </button>
            </div>
          </Html>
        </group>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

const SceneInner = ({ sites, variant, activeId, onActive, play, reduced }: SceneProps) => {
  const revealRef = useRef(0);
  const [markersOn, setMarkersOn] = useState(false);

  useFrame((_, delta) => {
    if (reduced) revealRef.current = 1;
    else if (play) revealRef.current = Math.min(1, revealRef.current + delta / 1.7);
    if (!markersOn && revealRef.current > 0.82) setMarkersOn(true);
  });

  return (
    <Rig reduced={reduced}>
      <DotField sites={sites} revealRef={revealRef} reduced={reduced} />
      <Arcs sites={sites} variant={variant} revealRef={revealRef} reduced={reduced} />
      <Markers
        sites={sites}
        variant={variant}
        activeId={activeId}
        onActive={onActive}
        markersOn={markersOn}
      />
    </Rig>
  );
};

const SiteMapScene = (props: SceneProps) => (
  <Canvas
    camera={{ fov: FOV, near: 10, far: 5000, position: [0, 0, 1200] }}
    dpr={[1, 2]}
    gl={{ antialias: true, alpha: true }}
    className="!absolute !inset-0"
  >
    <SceneInner {...props} />
  </Canvas>
);

export default SiteMapScene;
