import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import * as THREE from 'three';
import { AstronautSuit } from './Explorer';
import { useSceneFrame } from './SceneActivity';
import { useArchive } from '../stores/archive';
import { flightInput } from '../game/input';
import type { MarsStop } from '../data/expedition';

// Authored footpath inside the terrain's flat central clearing, not a historical route.
const start = new THREE.Vector3(7, 0, 7);
const end = new THREE.Vector3(4.5, 0, 1.8);
const heading = Math.atan2(end.x - start.x, end.z - start.z);
const moving = () => {
  const s = useArchive.getState();
  return s.marsWalking && !s.paused && !s.inspector && flightInput.z < 0;
};
export default function MarsExplorer({ chapter }: { chapter: MarsStop }) {
  const body = useRef<THREE.Group>(null);
  const phase = useRef(0);
  const target = useRef(new THREE.Vector3());
  const { walking, inspector, approached, stage } = useArchive(useShallow(s => ({
    walking: s.marsWalking, inspector: s.inspector, stage: s.stage,
    approached: chapter === 'sojourner' ? s.marsApproached : chapter === 'spirit' ? s.spiritApproached : s.opportunityApproached,
  })));
  const visible = !inspector && stage === (chapter === 'sojourner' ? 'mars' : chapter) && (walking || approached);
  useSceneFrame(({ camera }, dt) => {
    if (!visible || !body.current) return;
    const s = useArchive.getState();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const advance = moving();
    const progress = s.marsWalking ? Math.min(1, s.marsWalk + (advance ? Math.min(dt, .1) / 6 : 0)) : 1;
    if (advance) phase.current += Math.min(dt, .1) * 6;
    body.current.position.lerpVectors(start, end, progress);
    body.current.position.y = advance && !reduced ? Math.sin(phase.current * 2) * .025 : 0;
    if (!s.marsWalking || s.paused) return;
    if (camera instanceof THREE.PerspectiveCamera) camera.clearViewOffset();
    target.current.copy(body.current.position).add(new THREE.Vector3(1.8, 2.8, 4.8));
    camera.position.lerp(target.current, reduced ? 1 : 1 - Math.exp(-Math.min(dt, .1) * 5));
    camera.lookAt(body.current.position.x - 2.7, 1.1, body.current.position.z - 4.5);
    if (progress !== s.marsWalk) useArchive.setState({ marsWalk: progress });
    if (progress === 1 || reduced) s.finishMarsWalk();
  });
  return <group visible={visible}>
    <group ref={body} position={start} rotation={[0, heading, 0]}>
      <AstronautSuit isWalking={moving}/>
    </group>
    {Array.from({ length: 20 }, (_, i) => {
      const p = start.clone().lerp(end, i / 19);
      return <mesh key={i} position={[p.x + (i % 2 ? .11 : -.11), .006, p.z]} rotation={[-Math.PI / 2, 0, -heading]}>
        <planeGeometry args={[.14, .25]}/><meshStandardMaterial color="#5d4938" transparent opacity={.45} depthWrite={false}/>
      </mesh>;
    })}
  </group>;
}
