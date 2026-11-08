"use client";

import { Canvas } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";

export type V3 = [number, number, number];

const VARS = ["c1", "c2", "c3", "cb", "fg", "muted", "grid", "axis"] as const;
export type Palette = Record<(typeof VARS)[number], string>;

/** CSS 변수의 색을 읽어 Three.js 머티리얼에 사용 (다크모드 대응) */
export function usePalette(): Palette {
  const read = (): Palette => {
    const fallback: Palette = {
      c1: "#2f6fdf",
      c2: "#e8590c",
      c3: "#2b9a66",
      cb: "#d6336c",
      fg: "#1c1b19",
      muted: "#6b6860",
      grid: "#d9d5cc",
      axis: "#8a867c",
    };
    if (typeof window === "undefined") return fallback;
    const cs = getComputedStyle(document.documentElement);
    const out = { ...fallback };
    for (const k of VARS) out[k] = cs.getPropertyValue(`--${k}`).trim() || fallback[k];
    return out;
  };
  const [p, setP] = useState<Palette>(read);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => setP(read());
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return p;
}

/** z축이 위를 향하는 수학 좌표계 3D 장면 */
export function Scene3D({
  children,
  palette,
  extent = 4,
  camera = [7, -9, 6],
  height = 420,
}: {
  children: ReactNode;
  palette: Palette;
  extent?: number;
  camera?: V3;
  height?: number;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border" style={{ height }}>
      <Canvas
        camera={{ position: camera, up: [0, 0, 1], fov: 40, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, -3, 8]} intensity={0.8} />
        <Axes extent={extent} palette={palette} />
        {children}
        <OrbitControls makeDefault enableDamping dampingFactor={0.12} minDistance={4} maxDistance={40} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-muted">드래그: 회전 · 휠: 확대</div>
    </div>
  );
}

function Axes({ extent, palette }: { extent: number; palette: Palette }) {
  const grid = useMemo(() => {
    const pts: V3[][] = [];
    for (let i = -extent; i <= extent; i++) {
      pts.push([
        [i, -extent, 0],
        [i, extent, 0],
      ]);
      pts.push([
        [-extent, i, 0],
        [extent, i, 0],
      ]);
    }
    return pts;
  }, [extent]);
  const e = extent + 0.6;
  return (
    <group>
      {grid.map((p, i) => (
        <Line key={i} points={p} color={palette.grid} lineWidth={1} />
      ))}
      <Line points={[[-e, 0, 0], [e, 0, 0]]} color={palette.axis} lineWidth={1.5} />
      <Line points={[[0, -e, 0], [0, e, 0]]} color={palette.axis} lineWidth={1.5} />
      <Line points={[[0, 0, -e * 0.6], [0, 0, e]]} color={palette.axis} lineWidth={1.5} />
      <Label3D position={[e + 0.2, 0, 0]} color={palette.muted}>
        x
      </Label3D>
      <Label3D position={[0, e + 0.2, 0]} color={palette.muted}>
        y
      </Label3D>
      <Label3D position={[0, 0, e + 0.2]} color={palette.muted}>
        z
      </Label3D>
    </group>
  );
}

export function Label3D({ position, color, children }: { position: V3; color: string; children: ReactNode }) {
  return (
    <Html position={position} center zIndexRange={[10, 0]}>
      <span className="label-3d" style={{ color }}>
        {children}
      </span>
    </Html>
  );
}

const Z = new THREE.Vector3(0, 0, 1);

export function Arrow3D({
  from = [0, 0, 0],
  to,
  color,
  radius = 0.045,
  opacity = 1,
}: {
  from?: V3;
  to: V3;
  color: string;
  radius?: number;
  opacity?: number;
}) {
  const { len, mid, quat, head, shaft } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = b.clone().sub(a);
    const len = d.length();
    const dir = len > 1e-6 ? d.clone().divideScalar(len) : Z.clone();
    const head = Math.min(0.32, len * 0.4);
    const shaft = Math.max(0, len - head);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const mid = a.clone().add(dir.clone().multiplyScalar(shaft / 2));
    return { len, mid, quat, head, shaft, dir };
  }, [from, to]);
  if (len < 1e-3) return null;
  const tipBase = new THREE.Vector3(...from).add(
    new THREE.Vector3(...to).sub(new THREE.Vector3(...from)).normalize().multiplyScalar(shaft + head / 2),
  );
  const transparent = opacity < 1;
  return (
    <group>
      <mesh position={mid} quaternion={quat}>
        <cylinderGeometry args={[radius, radius, shaft, 12]} />
        <meshStandardMaterial color={color} transparent={transparent} opacity={opacity} />
      </mesh>
      <mesh position={tipBase} quaternion={quat}>
        <coneGeometry args={[radius * 2.8, head, 16]} />
        <meshStandardMaterial color={color} transparent={transparent} opacity={opacity} />
      </mesh>
    </group>
  );
}

/** n · p = d 평면 (반투명) */
export function Plane3D({
  n,
  d,
  color,
  size = 9,
  opacity = 0.28,
}: {
  n: V3;
  d: number;
  color: string;
  size?: number;
  opacity?: number;
}) {
  const { pos, quat, ok } = useMemo(() => {
    const nv = new THREE.Vector3(...n);
    const len = nv.length();
    if (len < 1e-9) return { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), ok: false };
    const u = nv.clone().divideScalar(len);
    const pos = u.clone().multiplyScalar(d / len);
    const quat = new THREE.Quaternion().setFromUnitVectors(Z, u);
    return { pos, quat, ok: true };
  }, [n, d]);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(size, size)), [size]);
  useEffect(() => () => edges.dispose(), [edges]);
  if (!ok) return null;
  return (
    <group position={pos} quaternion={quat}>
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

export function Point3D({ p, color, r = 0.12 }: { p: V3; color: string; r?: number }) {
  return (
    <mesh position={p}>
      <sphereGeometry args={[r, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
    </mesh>
  );
}

// ---------- 3x3 선형대수 유틸 ----------
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const det3 = (r1: V3, r2: V3, r3: V3) => dot(r1, cross(r2, r3));

/** 행벡터 r1,r2,r3 와 b 로 Ax=b 를 풂 (크래머) */
export function solve3(rows: [V3, V3, V3], b: V3): V3 | null {
  const [r1, r2, r3] = rows;
  const D = det3(r1, r2, r3);
  if (Math.abs(D) < 1e-9) return null;
  // 열벡터
  const c1: V3 = [r1[0], r2[0], r3[0]];
  const c2: V3 = [r1[1], r2[1], r3[1]];
  const c3: V3 = [r1[2], r2[2], r3[2]];
  const colDet = (a: V3, b2: V3, c: V3) => dot(a, cross(b2, c));
  return [colDet(b, c2, c3) / D, colDet(c1, b, c3) / D, colDet(c1, c2, b) / D];
}

/** 두 평면의 교선을 [-L, L] 구간 선분으로 */
export function planeIntersection(n1: V3, d1: number, n2: V3, d2: number, L = 6): [V3, V3] | null {
  const dir = cross(n1, n2);
  const dd = dot(dir, dir);
  if (dd < 1e-9) return null;
  // p = ((d1 n2 - d2 n1) × dir) / |dir|² ... 표준 공식: p = (d1 (n2×dir) + d2 (dir×n1)) / |dir|²
  const p = scale(add(scale(cross(n2, dir), d1), scale(cross(dir, n1), d2)), 1 / dd);
  const u = scale(dir, 1 / Math.sqrt(dd));
  return [add(p, scale(u, -L)), add(p, scale(u, L))];
}
