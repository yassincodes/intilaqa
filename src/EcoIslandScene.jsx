/* eslint-disable react-hooks/immutability, react-hooks/purity, react-hooks/refs */
import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  Sparkles,
  Stars,
  ContactShadows,
  Cloud,
  MeshTransmissionMaterial,
  shaderMaterial,
  Text,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration,
  Noise,
  GodRays,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize, ToneMappingMode } from "postprocessing";
import { useControls, folder, Leva } from "leva";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

/* ──────────────────────────────────────────────────────────────
   Custom water shader for the soft pond around the island.
   Uses simple sin-noise on a plane — no textures required.
   ────────────────────────────────────────────────────────────── */
const WaterMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#0EA5E9"),
    uColorB: new THREE.Color("#166534"),
    uColorC: new THREE.Color("#86EFAC"),
    uOpacity: 0.85,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 p = position;
      float w =
        sin(p.x * 1.6 + uTime * 0.7) * 0.04 +
        cos(p.y * 1.9 + uTime * 0.55) * 0.05 +
        sin((p.x + p.y) * 2.4 + uTime * 0.9) * 0.03;
      p.z += w;
      vec4 wp = modelMatrix * vec4(p, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uOpacity;
    void main() {
      float d = distance(vUv, vec2(0.5));
      float ripple = 0.5 + 0.5 * sin(d * 24.0 - uTime * 2.0);
      vec3 c = mix(uColorB, uColorA, smoothstep(0.0, 0.6, d));
      c = mix(c, uColorC, ripple * 0.18);
      float edge = smoothstep(0.5, 0.46, d);
      float alpha = uOpacity * edge;
      gl_FragColor = vec4(c, alpha);
    }
  `,
);
extend({ WaterMaterial });

/* ──────────────────────────────────────────────────────────────
   Reusable: a glowing leaf shape (built from THREE shape geometry)
   ────────────────────────────────────────────────────────────── */
function leafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.4, 0.2, 0.55, 0.7, 0, 1.1);
  shape.bezierCurveTo(-0.55, 0.7, -0.4, 0.2, 0, 0);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.02,
    bevelThickness: 0.02,
    curveSegments: 14,
  });
}

/* ──────────────────────────────────────────────────────────────
   Bioluminescent flower (instanced for perf)
   ────────────────────────────────────────────────────────────── */
function FlowerCluster({ count = 36 }) {
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 1.85;
      arr.push({
        pos: [
          Math.cos(angle) * radius,
          0.05 + Math.random() * 0.04,
          Math.sin(angle) * radius,
        ],
        rotY: Math.random() * Math.PI * 2,
        scale: 0.05 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
        color:
          Math.random() < 0.5
            ? new THREE.Color("#86EFAC")
            : new THREE.Color("#FBBF24"),
      });
    }
    return arr;
  }, [count]);

  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      const p = positions[i];
      const sway = Math.sin(t * 1.2 + p.phase) * 0.07;
      c.rotation.z = sway;
      c.position.y = p.pos[1] + Math.sin(t * 1.6 + p.phase) * 0.02;
    });
  });

  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <group
          key={i}
          position={p.pos}
          rotation={[0, p.rotY, 0]}
          scale={p.scale}
        >
          {/* stem */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.8, 6]} />
            <meshStandardMaterial color="#0F4D27" />
          </mesh>
          {/* flower head */}
          {[0, 1, 2, 3, 4].map((k) => (
            <mesh
              key={k}
              position={[
                Math.cos((k / 5) * Math.PI * 2) * 0.18,
                0.85,
                Math.sin((k / 5) * Math.PI * 2) * 0.18,
              ]}
            >
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial
                color={p.color}
                emissive={p.color}
                emissiveIntensity={1.6}
                toneMapped={false}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshStandardMaterial
              color="#FEF3C7"
              emissive="#D97706"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Crystalline grass tufts (instanced glowing blades)
   ────────────────────────────────────────────────────────────── */
function GrassField({ count = 220 }) {
  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 1.95;
      arr.push({
        position: [Math.cos(angle) * r, 0.04, Math.sin(angle) * r],
        scale: 0.6 + Math.random() * 1.1,
        rotY: Math.random() * Math.PI,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      const d = data[i];
      c.rotation.z = Math.sin(t * 1.4 + d.phase) * 0.18;
    });
  });

  return (
    <group ref={ref}>
      {data.map((d, i) => (
        <mesh
          key={i}
          position={d.position}
          rotation={[0, d.rotY, 0]}
          scale={[0.04, 0.18 * d.scale, 0.04]}
        >
          <coneGeometry args={[1, 1.6, 4]} />
          <meshStandardMaterial
            color="#22823F"
            emissive="#16A34A"
            emissiveIntensity={0.45}
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Trees — stylised crystalline trees on the island
   ────────────────────────────────────────────────────────────── */
function CrystalTree({ position = [0, 0, 0], scale = 1, seed = 0 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.6 + seed) * 0.04;
    ref.current.rotation.x = Math.cos(t * 0.5 + seed) * 0.03;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, 1, 8]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {/* foliage (translucent crystal) */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <icosahedronGeometry args={[0.65, 1]} />
        <MeshTransmissionMaterial
          color="#86EFAC"
          thickness={0.6}
          transmission={1}
          ior={1.4}
          roughness={0.15}
          chromaticAberration={0.06}
          backside
          backsideThickness={0.4}
          distortion={0.25}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>
      <mesh position={[0.32, 1.05, 0.18]} castShadow>
        <icosahedronGeometry args={[0.4, 1]} />
        <MeshTransmissionMaterial
          color="#22C55E"
          thickness={0.45}
          transmission={1}
          ior={1.35}
          roughness={0.2}
          chromaticAberration={0.05}
          backside
          distortion={0.2}
        />
      </mesh>
      <mesh position={[-0.28, 1.15, -0.2]} castShadow>
        <icosahedronGeometry args={[0.36, 1]} />
        <MeshTransmissionMaterial
          color="#A7F3D0"
          thickness={0.4}
          transmission={1}
          ior={1.3}
          roughness={0.2}
          chromaticAberration={0.05}
          backside
        />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Floating golden orb with logo text (tiny "الانطلاقة")
   Orbits around the island
   ────────────────────────────────────────────────────────────── */
function LogoOrb({ orbitRadius = 3.6, speed = 0.18, height = 1.4, phase = 0 }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    group.current.position.set(
      Math.cos(t) * orbitRadius,
      height + Math.sin(t * 2.4) * 0.18,
      Math.sin(t) * orbitRadius,
    );
    group.current.rotation.y = -t;
  });
  return (
    <group ref={group}>
      {/* orb core */}
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#D97706"
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>
      {/* halo */}
      <mesh>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshBasicMaterial
          color="#FBBF24"
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
      {/* small label disc */}
      <Text
        font="https://fonts.gstatic.com/s/tajawal/v11/Iurf6YBj_oCad4k1l_6gLrZjiLlJ-G0.woff"
        position={[0, -0.45, 0]}
        fontSize={0.13}
        color="#FEF3C7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#92400E"
      >
        الانطلاقة
      </Text>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Floating leaves in the air (instanced)
   ────────────────────────────────────────────────────────────── */
function FloatingLeaves({ count = 24 }) {
  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 9,
        y: 1.2 + Math.random() * 4,
        z: (Math.random() - 0.5) * 9,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        scale: 0.18 + Math.random() * 0.18,
        rotZ: Math.random() * Math.PI,
        color:
          Math.random() < 0.66
            ? new THREE.Color("#22C55E")
            : new THREE.Color("#FBBF24"),
      });
    }
    return arr;
  }, [count]);

  const ref = useRef();
  const geom = useMemo(() => leafGeometry(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((m, i) => {
      const d = data[i];
      m.position.x = d.x + Math.sin(t * d.speed + d.phase) * 0.6;
      m.position.y =
        d.y + Math.sin(t * (d.speed * 0.6) + d.phase) * 0.4 - (t * 0.05) % 2;
      m.position.z = d.z + Math.cos(t * d.speed + d.phase) * 0.5;
      m.rotation.z = d.rotZ + t * 0.3 * d.speed;
      m.rotation.x = Math.sin(t * d.speed) * 0.6;
    });
  });

  return (
    <group ref={ref}>
      {data.map((d, i) => (
        <mesh key={i} geometry={geom} scale={d.scale}>
          <meshStandardMaterial
            color={d.color}
            emissive={d.color}
            emissiveIntensity={0.55}
            metalness={0.15}
            roughness={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Floating books — stylised tomes around the island
   ────────────────────────────────────────────────────────────── */
function FloatingBooks() {
  const books = [
    { p: [-3.2, 1.6, -1.4], c: "#0EA5E9", phase: 0 },
    { p: [3.4, 2.2, 0.9], c: "#D97706", phase: 1.6 },
    { p: [-2.1, 2.8, 2.4], c: "#86EFAC", phase: 2.4 },
    { p: [2.6, 1.4, -2.6], c: "#22C55E", phase: 3.1 },
  ];
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((m, i) => {
      const b = books[i];
      m.position.y = b.p[1] + Math.sin(t * 0.7 + b.phase) * 0.18;
      m.rotation.y = t * 0.25 + b.phase;
      m.rotation.x = Math.sin(t * 0.5 + b.phase) * 0.22;
    });
  });
  return (
    <group ref={ref}>
      {books.map((b, i) => (
        <group key={i} position={b.p}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.65, 0.12]} />
            <meshStandardMaterial color={b.c} metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.42, 0.55, 0.02]} />
            <meshStandardMaterial color="#F8F1E3" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Sun / lighthouse (will act as the GodRays source)
   ────────────────────────────────────────────────────────────── */
function Sun({ sunRef }) {
  return (
    <mesh ref={sunRef} position={[6, 5, -7]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshBasicMaterial color="#FEF3C7" toneMapped={false} />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────────
   The eco island — base rock, water, and decoration
   ────────────────────────────────────────────────────────────── */
function EcoIsland() {
  const islandRef = useRef();
  useFrame((state) => {
    if (!islandRef.current) return;
    const t = state.clock.elapsedTime;
    islandRef.current.position.y = Math.sin(t * 0.45) * 0.18;
    islandRef.current.rotation.y = t * 0.04;
  });

  return (
    <group ref={islandRef}>
      {/* Rock base — inverted cone */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.4, 1.6, 9, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial
          color="#3E2723"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Mossy top disc */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.3, 2.4, 0.18, 64]} />
        <meshStandardMaterial
          color="#166534"
          roughness={0.7}
          metalness={0.05}
          emissive="#0F4D27"
          emissiveIntensity={0.18}
        />
      </mesh>
      {/* Water disc */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.15, 64]} />
        <waterMaterial transparent depthWrite={false} />
      </mesh>
      {/* Soft glow ring under island */}
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 3.2, 64]} />
        <meshBasicMaterial
          color="#0EA5E9"
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>

      <GrassField count={180} />
      <FlowerCluster count={26} />

      <CrystalTree position={[0.6, 0.13, 0.3]} scale={1} seed={0} />
      <CrystalTree position={[-0.9, 0.13, -0.5]} scale={0.85} seed={1.2} />
      <CrystalTree position={[1.1, 0.13, -1.1]} scale={0.7} seed={2.1} />
      <CrystalTree position={[-1.5, 0.13, 0.6]} scale={0.6} seed={3.4} />

      {/* Tiny lantern boulders */}
      {[
        [1.6, 0.18, 0.4],
        [-1.7, 0.18, -0.3],
        [0.2, 0.18, 1.7],
        [0.4, 0.18, -1.7],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <icosahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#FEF3C7"
            emissive="#D97706"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Animated water material time tick + camera rig
   ────────────────────────────────────────────────────────────── */
function SceneTicker() {
  useFrame((state) => {
    state.scene.traverse((obj) => {
      if (obj.material && obj.material.uTime !== undefined) {
        obj.material.uTime = state.clock.elapsedTime;
      }
    });
  });
  return null;
}

function CameraRig({ enableParallax = true, dollyAmount = 0.4 }) {
  const { camera, mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.4, 0));
  const initial = useRef({
    pos: new THREE.Vector3(0, 1.6, 7.6),
    radius: 7.6,
    angle: 0,
  });

  useEffect(() => {
    camera.position.copy(initial.current.pos);
    camera.lookAt(target.current);
  }, [camera]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // slow orbit
    initial.current.angle += delta * 0.06;
    const baseX = Math.sin(initial.current.angle) * initial.current.radius;
    const baseZ = Math.cos(initial.current.angle) * initial.current.radius;
    const baseY = 1.6 + Math.sin(t * 0.18) * 0.25;

    // gentle forward dolly (breathing)
    const dolly = 1 - (Math.sin(t * 0.25) * 0.5 + 0.5) * dollyAmount * 0.05;

    // mouse parallax
    const mx = enableParallax ? mouse.x * 0.6 : 0;
    const my = enableParallax ? mouse.y * 0.4 : 0;

    camera.position.x += (baseX * dolly + mx - camera.position.x) * 0.04;
    camera.position.y += (baseY + my - camera.position.y) * 0.04;
    camera.position.z += (baseZ * dolly - camera.position.z) * 0.04;
    camera.lookAt(target.current);
  });

  return null;
}

/* ──────────────────────────────────────────────────────────────
   Effects pipeline (post-processing)
   ────────────────────────────────────────────────────────────── */
function Effects({ sunRef, settings }) {
  const sun = sunRef.current;
  return (
    <EffectComposer multisampling={4} disableNormalPass>
      {sun && (
        <GodRays
          sun={sun}
          blendFunction={BlendFunction.SCREEN}
          samples={settings.godRaySamples}
          density={settings.godRayDensity}
          decay={settings.godRayDecay}
          weight={0.45}
          exposure={0.45}
          clampMax={1}
          kernelSize={KernelSize.SMALL}
          blur
        />
      )}
      <Bloom
        intensity={settings.bloomIntensity}
        luminanceThreshold={settings.bloomThreshold}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={settings.bloomRadius}
        kernelSize={KernelSize.LARGE}
      />
      <DepthOfField
        focusDistance={settings.dofFocus}
        focalLength={settings.dofFocalLength}
        bokehScale={settings.dofBokeh}
      />
      <ChromaticAberration
        offset={[settings.chromatic, settings.chromatic]}
        radialModulation={true}
        modulationOffset={0.5}
      />
      <Noise opacity={settings.noise} premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.18} darkness={settings.vignette} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}

/* ──────────────────────────────────────────────────────────────
   The main exported scene component
   Pass `showLeva={false}` from production to hide the panel.
   ────────────────────────────────────────────────────────────── */
export default function EcoIslandScene({ showLeva = true }) {
  const sunRef = useRef();

  const settings = useControls(
    "🎬 Cinematic FX",
    {
      bloom: folder({
        bloomIntensity: { value: 1.6, min: 0, max: 4, step: 0.05, label: "intensity" },
        bloomThreshold: { value: 0.18, min: 0, max: 1, step: 0.01, label: "threshold" },
        bloomRadius: { value: 0.85, min: 0, max: 1, step: 0.01, label: "radius" },
      }),
      dof: folder({
        dofFocus: { value: 0.018, min: 0, max: 0.05, step: 0.001, label: "focus dist" },
        dofFocalLength: { value: 0.04, min: 0, max: 0.4, step: 0.005, label: "focal len" },
        dofBokeh: { value: 3, min: 0, max: 8, step: 0.1, label: "bokeh" },
      }),
      godRays: folder({
        godRaySamples: { value: 60, min: 8, max: 120, step: 1, label: "samples" },
        godRayDensity: { value: 0.96, min: 0, max: 1.5, step: 0.02, label: "density" },
        godRayDecay: { value: 0.92, min: 0, max: 1.0, step: 0.01, label: "decay" },
      }),
      grade: folder({
        chromatic: { value: 0.0008, min: 0, max: 0.005, step: 0.0001, label: "chromatic" },
        noise: { value: 0.06, min: 0, max: 0.3, step: 0.005, label: "grain" },
        vignette: { value: 0.55, min: 0, max: 1, step: 0.01, label: "vignette" },
      }),
      camera: folder({
        parallax: { value: true, label: "mouse parallax" },
        dolly: { value: 0.4, min: 0, max: 1, step: 0.05, label: "dolly" },
      }),
    },
    { collapsed: true },
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 50% 60%, #0d3b2a 0%, #07241a 45%, #02110b 100%)",
      }}
    >
      <Leva
        hidden={!showLeva}
        collapsed
        titleBar={{ title: "Eco TV · Cinematic" }}
        theme={{
          colors: {
            elevation1: "#0b1411",
            elevation2: "#11231d",
            elevation3: "#0f4d27",
            accent1: "#22c55e",
            accent2: "#86efac",
            accent3: "#d97706",
            highlight1: "#86efac",
            highlight2: "#fef3c7",
            highlight3: "#fff",
          },
        }}
      />
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 1.6, 7.6] }}
      >
        <color attach="background" args={["#06140d"]} />
        <fog attach="fog" args={["#0a2620", 8, 22]} />

        <Suspense fallback={null}>
          {/* ambient setup */}
          <ambientLight intensity={0.32} />
          <hemisphereLight
            args={["#86efac", "#0f4d27", 0.5]}
            position={[0, 5, 0]}
          />
          <directionalLight
            position={[6, 8, -4]}
            intensity={2.2}
            color="#fef3c7"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={20}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />
          <pointLight
            position={[-3, 1.5, 3]}
            intensity={1.1}
            color="#0ea5e9"
            distance={8}
          />
          <pointLight
            position={[3, 1.2, -2]}
            intensity={0.9}
            color="#86efac"
            distance={6}
          />

          {/* HDRI environment for PBR reflections */}
          <Environment preset="forest" background={false} />

          <Stars
            radius={40}
            depth={20}
            count={2200}
            factor={3}
            saturation={0.4}
            fade
            speed={0.5}
          />

          {/* Subtle nebula clouds */}
          <group position={[0, 4, -8]}>
            <Cloud
              opacity={0.18}
              speed={0.08}
              segments={20}
              bounds={[12, 3, 4]}
              color="#86efac"
            />
            <Cloud
              opacity={0.12}
              speed={0.05}
              segments={18}
              bounds={[10, 2, 4]}
              color="#0ea5e9"
              position={[0, -1.2, 0]}
            />
          </group>

          <Sparkles
            count={140}
            scale={[10, 6, 10]}
            position={[0, 1.6, 0]}
            speed={0.3}
            size={3.5}
            color="#fef3c7"
            opacity={0.85}
          />
          <Sparkles
            count={90}
            scale={[8, 4, 8]}
            position={[0, 0.8, 0]}
            speed={0.4}
            size={2}
            color="#86efac"
            opacity={0.7}
          />

          {/* Sun source for GodRays */}
          <Sun sunRef={sunRef} />

          {/* The hero element */}
          <Float
            speed={1.1}
            rotationIntensity={0.18}
            floatIntensity={0.55}
            floatingRange={[-0.1, 0.1]}
          >
            <EcoIsland />
          </Float>

          <FloatingLeaves count={28} />
          <FloatingBooks />

          {/* Logo orbs orbiting */}
          <LogoOrb orbitRadius={3.4} speed={0.18} height={1.6} phase={0} />
          <LogoOrb orbitRadius={3.2} speed={-0.14} height={2.2} phase={2.0} />
          <LogoOrb orbitRadius={3.8} speed={0.12} height={0.9} phase={4.0} />

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.55}
            scale={12}
            blur={2.6}
            far={4}
            color="#02110b"
          />

          <SceneTicker />
          <CameraRig enableParallax={settings.parallax} dollyAmount={settings.dolly} />

          <Effects sunRef={sunRef} settings={settings} />
        </Suspense>
      </Canvas>
    </div>
  );
}
