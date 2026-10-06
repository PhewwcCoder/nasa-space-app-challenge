import { memo } from 'react';
import { useMemo } from 'react';
import type {} from '@react-three/fiber';
import { DoubleSide, Quaternion, Vector3 } from 'three';

export type SurveyCraftProps = { thrust: number; bankX?: number; bankZ?: number };
const hull = { color: '#849097', metalness: 0.35, roughness: 0.36, flatShading: true };
const panel = { color: '#151d25', metalness: 0.7, roughness: 0.5 };
const edge = { color: '#aab8bc', metalness: 0.45, roughness: 0.3 };
const cyan = { color: '#b7edf0', emissive: '#6de1e8', emissiveIntensity: 2, toneMapped: false };

function Strut({ from, to, radius = 0.045 }: { from: [number, number, number]; to: [number, number, number]; radius?: number }) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from), b = new Vector3(...to), delta = b.clone().sub(a);
    return { midpoint: a.add(b).multiplyScalar(0.5), length: delta.length(), quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), delta.normalize()) };
  }, [from, to]);
  return <mesh position={midpoint} quaternion={quaternion} castShadow><cylinderGeometry args={[radius, radius, length, 6]} /><meshStandardMaterial {...edge} /></mesh>;
}

/** Authored fictional alien survey craft. Feet rest at local y=0 when level. ~47 meshes. */
function SurveyCraft({ thrust, bankX = 0, bankZ = 0 }: SurveyCraftProps) {
  const power = Math.max(0, Math.min(1, thrust));
  return <group rotation={[bankX, 0, bankZ]}>
    <mesh position={[0, 1.16, 0]} scale={[1.32, 0.42, 1]} castShadow receiveShadow><icosahedronGeometry args={[1.5, 0]} /><meshStandardMaterial {...hull} /></mesh>
    <mesh position={[0, 1.43, 0.04]} rotation={[0, Math.PI / 8, 0]} castShadow><cylinderGeometry args={[0.65, 1.05, 0.35, 8]} /><meshStandardMaterial {...panel} /></mesh>
    <mesh position={[0, 1.64, 0.04]} rotation={[0, Math.PI / 8, 0]} castShadow><cylinderGeometry args={[0.56, 0.66, 0.12, 8]} /><meshStandardMaterial {...hull} /></mesh>
    <mesh position={[0, 1.23, -1.09]} rotation={[-0.23, 0, 0]}><boxGeometry args={[0.8, 0.19, 0.08]} /><meshStandardMaterial color="#07151c" metalness={0.6} roughness={0.15} /></mesh>
    <mesh position={[0, 1.27, -1.14]}><boxGeometry args={[0.39, 0.025, 0.014]} /><meshStandardMaterial {...cyan} /></mesh>
    <mesh position={[0, 0.76, 0]}><cylinderGeometry args={[0.41, 0.56, 0.36, 12, 1, true]} /><meshStandardMaterial {...panel} side={DoubleSide} /></mesh>
    <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.54, 0.036, 5, 16]} /><meshStandardMaterial {...edge} /></mesh>
    <mesh position={[0, 1.84, 0.26]} castShadow><boxGeometry args={[0.055, 0.34, 0.055]} /><meshStandardMaterial {...edge} /></mesh>
    <mesh position={[0, 2.01, 0.26]}><octahedronGeometry args={[0.13]} /><meshStandardMaterial {...panel} /></mesh>
    {[-1, 1].flatMap(x => [-1, 1].map(z => <group key={`${x}:${z}`}>
      <mesh position={[x * 1.28, 1.05, z * 0.81]} rotation={[0, -x * z * 0.25, 0]} castShadow><boxGeometry args={[0.84, 0.25, 0.62]} /><meshStandardMaterial {...hull} /></mesh>
      <mesh position={[x * 1.3, 1.19, z * 0.81]} rotation={[0, -x * z * 0.25, 0]}><boxGeometry args={[0.6, 0.025, 0.43]} /><meshStandardMaterial {...panel} /></mesh>
      <mesh position={[x * 1.63, 1.1, z * 0.81]}><boxGeometry args={[0.025, 0.043, 0.19]} /><meshStandardMaterial {...cyan} /></mesh>
      <Strut from={[x * 1.04, 0.95, z * 0.63]} to={[x * 1.87, 0.14, z * 1.14]} radius={0.065} />
      <Strut from={[x * 0.53, 0.93, z * 0.89]} to={[x * 1.87, 0.14, z * 1.14]} />
      <mesh position={[x * 1.87, 0.06, z * 1.14]} castShadow><cylinderGeometry args={[0.21, 0.29, 0.12, 6]} /><meshStandardMaterial {...hull} /></mesh>
      <mesh position={[x * 1.3, 0.82, z * 0.81]}><cylinderGeometry args={[0.15, 0.23, 0.26, 10, 1, true]} /><meshStandardMaterial {...panel} side={DoubleSide} /></mesh>
      <mesh position={[x * 1.3, 0.695, z * 0.81]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.22, 0.027, 5, 12]} /><meshStandardMaterial {...edge} /></mesh>
      {power > 0.01 && <mesh position={[x * 1.3, 0.63 - power * 0.23, z * 0.81]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.145, 0.12 + power * 0.46, 10, 1, true]} /><meshBasicMaterial color="#91e5ee" transparent opacity={0.2 + power * 0.25} depthWrite={false} side={DoubleSide} /></mesh>}
    </group>))}
    <mesh position={[0, 1.68, 0.04]} rotation={[Math.PI / 2, 0, Math.PI / 8]}><ringGeometry args={[0.44, 0.46, 8]} /><meshStandardMaterial {...edge} side={DoubleSide} /></mesh>
  </group>;
}

export default memo(SurveyCraft);
