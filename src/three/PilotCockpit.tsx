import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { flightInput } from '../game/input';
import { useArchive } from '../stores/archive';

function Glove({side}:{side:number}) {
 const pivot=useRef<THREE.Group>(null);
 useFrame((_,dt)=>{if(!pivot.current)return;const paused=useArchive.getState().paused;const x=paused?0:flightInput.x,z=paused?0:flightInput.z;pivot.current.rotation.z=THREE.MathUtils.damp(pivot.current.rotation.z,-x*.15,8,dt);pivot.current.rotation.x=THREE.MathUtils.damp(pivot.current.rotation.x,z*.13,8,dt);});
 return <group ref={pivot} rotation={[0,side*-.12,side*-.12]}>
  <mesh position={[0,-.19,.12]} rotation={[-.5,0,0]}><capsuleGeometry args={[.112,.42,8,20]}/><meshStandardMaterial color="#b7bbb6" roughness={.8}/></mesh>
  {[0,1,2].map(i=><mesh key={i} position={[0,-.12-i*.04,.075+i*.02]} rotation={[Math.PI/2-.5,0,0]}><torusGeometry args={[.116,.009,8,24]}/><meshStandardMaterial color="#424a4c" roughness={.8}/></mesh>)}
  <mesh position={[0,-.018,.016]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.115,.019,10,24]}/><meshStandardMaterial color="#bd793e" metalness={.5} roughness={.45}/></mesh>
  <RoundedBox position={[0,.105,-.005]} args={[.22,.23,.13]} radius={.045} smoothness={4}><meshStandardMaterial color="#d6d8cf" roughness={.72}/></RoundedBox>
  <RoundedBox position={[0,.10,.07]} args={[.16,.14,.028]} radius={.023} smoothness={3}><meshStandardMaterial color="#586266" roughness={.85}/></RoundedBox>
  <mesh position={[0,.13,-.115]}><cylinderGeometry args={[.045,.05,.39,16]}/><meshStandardMaterial color="#1c2529" metalness={.6} roughness={.4}/></mesh>
  <mesh position={[0,.335,-.115]}><sphereGeometry args={[.055,16,12]}/><meshStandardMaterial color="#343e41"/></mesh>
  <mesh position={[0,.36,-.075]}><sphereGeometry args={[.018,12,8]}/><meshStandardMaterial color="#de9553" emissive="#af4d14" emissiveIntensity={.4}/></mesh>
  {[-.078,-.026,.026,.078].map((x,i)=><group key={i} position={[x,.215-Math.abs(x)*.25,-.006]}>
   <mesh rotation={[-.5,0,0]} position={[0,.024,-.033]}><capsuleGeometry args={[.026,.066,5,12]}/><meshStandardMaterial color="#c5cbc4" roughness={.9}/></mesh>
   <mesh rotation={[-1.18,0,0]} position={[0,.05,-.086]}><capsuleGeometry args={[.025,.055,5,12]}/><meshStandardMaterial color="#b3beb7" roughness={.9}/></mesh>
   <mesh rotation={[.35,0,0]} position={[0,.03,-.133]}><capsuleGeometry args={[.024,.034,5,12]}/><meshStandardMaterial color="#6f7b76" roughness={.9}/></mesh>
  </group>)}
  <mesh position={[side*.107,.12,-.067]} rotation={[-.5,0,side*-.65]}><capsuleGeometry args={[.035,.115,6,12]}/><meshStandardMaterial color="#c2c9bf" roughness={.85}/></mesh>
 </group>;
}
export default function PilotCockpit(){const rig=useRef<THREE.Group>(null);const {camera,size}=useThree();const narrow=size.width<761;const extent=narrow?.20:Math.min(1.1,size.width/size.height*.57);
 useFrame(()=>{if(rig.current){rig.current.position.copy(camera.position);rig.current.quaternion.copy(camera.quaternion);}});
 return <group ref={rig}>
  <pointLight position={[0,.25,-.7]} intensity={2.5} distance={3} color="#c5eaf5"/>
  <group position={[-extent,narrow?-.29:-.49,-1.4]} scale={narrow?.64:1}><Glove side={-1}/></group>
  <group position={[extent,narrow?-.29:-.49,-1.4]} scale={narrow?.64:1}><Glove side={1}/></group>
  {[-1,1].map(side=><group key={side} position={[side*(extent+.25),0,-1.5]} rotation={[0,0,side*-.13]}><mesh><boxGeometry args={[.055,2.5,.08]}/><meshStandardMaterial color="#263038" metalness={.8} roughness={.3}/></mesh><mesh position={[-side*.033,.05,.05]}><boxGeometry args={[.01,.34,.01]}/><meshBasicMaterial color="#b2deeb"/></mesh></group>)}
  <mesh position={[0,-.86,-1.6]} rotation={[-.25,0,0]}><boxGeometry args={[5,.22,.5]}/><meshStandardMaterial color="#182329" metalness={.65} roughness={.45}/></mesh>
 </group>;
}
