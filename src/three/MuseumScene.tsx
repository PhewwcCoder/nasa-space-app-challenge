import { Suspense, useMemo, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneFrame } from './SceneActivity';
import { useArchive } from '../stores/archive';
import { exhibits } from '../data/expedition';
import SojournerModel from './SojournerModel';
import ApolloModel from './ApolloModel';
import SpiritModel from './SpiritModel';

function SharedHardware({ index }: { index: number }) {
  const { scene } = useGLTF(exhibits[index].model!, '/draco/');
  const { scale, center } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene), size = box.getSize(new THREE.Vector3());
    return { scale: 4.3 / Math.max(size.x, size.y, size.z), center: box.getCenter(new THREE.Vector3()).negate() };
  }, [scene]);
  return <group scale={scale}><group position={center}>
    {index === 0 ? <group scale={1 / 1.28} position={[0, .13 / 1.28, 0]}><ApolloModel preview/></group> : <group position={[0, -.003, 0]}><SpiritModel artifact={index === 2 ? 'spirit' : index === 3 ? 'opportunity' : 'voyager'} url={exhibits[index].model!} rotation={0}/></group>}
  </group></group>;
}
function ExhibitModel({ index }: { index: number }) {
  return index === 1 ? <group scale={3.8} position={[0, -.85, 0]}><SojournerModel/></group> : <SharedHardware index={index}/>;
}
export default function MuseumScene({ active }: { active: boolean }) {
  const exhibit = useArchive(s => s.exhibit), { camera, size } = useThree();
  const turntable = useRef<THREE.Group>(null), time = useRef(0);
  useEffect(() => {
    if (!active) return;
    camera.position.set(0, 2.5, 12); camera.lookAt(0, .7, 0);
    if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
  }, [active, camera, size]);
  useSceneFrame((_, dt) => {
    if (!turntable.current || useArchive.getState().paused) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { turntable.current.rotation.y = -.5; turntable.current.position.y = 1.1; return; }
    time.current += Math.min(dt, .05);
    turntable.current.rotation.y = -.5 + time.current * .12;
    turntable.current.position.y = 1.1 + Math.sin(time.current * .8) * .1;
  });
  const background = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 512, 420, 0);
    gradient.addColorStop(0, '#45484b'); gradient.addColorStop(.42, '#b9bbbd');
    gradient.addColorStop(.75, '#e8e9e9'); gradient.addColorStop(1, '#fafaf8');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 512);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => background.dispose(), [background]);
  const mobile = size.width < 761;
  return <><primitive attach="background" object={background}/><ambientLight intensity={1.4}/><directionalLight position={[3, 7, 5]} intensity={3.2} color="#fff2d8"/><directionalLight position={[-5, 3, -2]} intensity={2} color="#c5e1ef"/>
    <group position={mobile ? [0, 2.3, 0] : [-2.75, 0, 0]} scale={mobile ? .39 : 1}>
      <mesh position={[0, -1.05, 0]}><cylinderGeometry args={[2.65, 2.85, .12, 80]}/><meshStandardMaterial color="#c4cdca" metalness={.2} roughness={.6}/></mesh>
      <group ref={turntable} position={[0, 1.1, 0]} rotation={[.08, -.5, 0]}><Suspense fallback={null}><ExhibitModel key={exhibit} index={exhibit}/></Suspense></group>
    </group></>;
}
