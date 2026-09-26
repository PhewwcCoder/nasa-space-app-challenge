import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { flightInput } from '../game/input';

// Authored explorer and path, not a reconstruction of an Apollo astronaut's route.
export default function Explorer(){
 const body=useRef<THREE.Group>(null),left=useRef<THREE.Group>(null),right=useRef<THREE.Group>(null);const clock=useRef(0);
 useFrame(({camera},dt)=>{const s=useArchive.getState();if(s.stage!=='surface'||s.inspector)return;const moving=flightInput.z<0&&!s.paused&&s.walk<1;const progress=Math.min(1,s.walk+(moving?Math.min(dt,.05)/7:0));if(progress!==s.walk)s.setWalk(progress);clock.current+=moving?dt*6:0;const x=32-progress*10,z=-1-progress*14;const bob=moving&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches?Math.sin(clock.current*2)*.055:0;
 if(body.current){body.current.position.set(x,bob,z);body.current.rotation.y=Math.atan2(-10,-14);}
 if(left.current&&right.current){left.current.rotation.x=moving?Math.sin(clock.current)*.38:0;right.current.rotation.x=-left.current.rotation.x;}
 const target=new THREE.Vector3(x+4,3.1,z+6);camera.position.lerp(target,1-Math.exp(-dt*5));camera.lookAt(x-2,1.7,z-5);
 });
 const suit=<meshStandardMaterial color="#d5d4c9" roughness={.88}/>;
 return <><group ref={body} position={[32,0,-1]}>
 <mesh position={[0,1.25,0]} castShadow><capsuleGeometry args={[.36,.56,8,16]}/>{suit}</mesh>
 <mesh position={[0,2.02,0]} castShadow><sphereGeometry args={[.43,24,20]}/>{suit}</mesh>
 <mesh position={[0,2.05,.28]}><sphereGeometry args={[.32,24,20]}/><meshStandardMaterial color="#342b1c" metalness={.85} roughness={.14}/></mesh>
 <mesh position={[0,1.34,-.36]} castShadow><boxGeometry args={[.58,.8,.33]}/><meshStandardMaterial color="#b9b7ac" roughness={.7}/></mesh>
 {[-1,1].map(side=><group key={side} position={[side*.49,1.5,0]} rotation={[.1,0,side*.14]}><mesh position={[0,-.3,0]} castShadow><capsuleGeometry args={[.15,.45,6,12]}/>{suit}</mesh><mesh position={[0,-.65,.05]}><sphereGeometry args={[.17,12,12]}/>{suit}</mesh></group>)}
 {[-1,1].map(side=><group key={side} ref={side<0?left:right} position={[side*.2,.87,0]}><mesh position={[0,-.3,0]} castShadow><capsuleGeometry args={[.19,.38,6,12]}/>{suit}</mesh><mesh position={[0,-.72,.1]} castShadow><boxGeometry args={[.37,.23,.58]}/><meshStandardMaterial color="#93928a" roughness={1}/></mesh></group>)}
 </group><group>{Array.from({length:26},(_,i)=>{const t=i/25;return <group key={i} position={[32-t*12+(i%2?.22:-.22),.012,-1-t*18]} rotation={[0,.62,0]}><mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.25,.46]}/><meshStandardMaterial color="#41423f" roughness={1}/></mesh>{Array.from({length:6},(_,j)=><mesh key={j} position={[0,.012,(j-2.5)*.063]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.22,.023]}/><meshStandardMaterial color="#93938a"/></mesh>)}</group>;})}</group></>;
}
