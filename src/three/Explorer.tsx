import { memo } from 'react';
import { useSceneFrame as useFrame } from './SceneActivity';
import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';
import { flightInput } from '../game/input';

// Authored explorer and path, not a reconstruction of an Apollo astronaut's route.
function Explorer(){
 const body=useRef<THREE.Group>(null);const clock=useRef(0);
 useFrame(({camera},dt)=>{const s=useArchive.getState();if(s.stage!=='surface'||s.inspector)return;const moving=flightInput.z<0&&!s.paused&&s.walk<1;const progress=Math.min(1,s.walk+(moving?Math.min(dt,.05)/7:0));if(progress!==s.walk)s.setWalk(progress);clock.current+=moving?dt*6:0;const x=32-progress*10,z=-1-progress*14;const bob=moving&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches?Math.sin(clock.current*2)*.055:0;
 if(body.current){body.current.position.set(x,bob,z);body.current.rotation.y=Math.atan2(-10,-14);}

 const target=new THREE.Vector3(x+4,3.1,z+6);camera.position.lerp(target,1-Math.exp(-dt*5));camera.lookAt(x-2,1.7,z-5);
 });
 return <><group ref={body} position={[32,0,-1]}><AstronautSuit/>
 </group><group>{Array.from({length:26},(_,i)=>{const t=i/25;return <group key={i} position={[32-t*12+(i%2?.22:-.22),.012,-1-t*18]} rotation={[0,.62,0]}><mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.25,.46]}/><meshStandardMaterial color="#41423f" roughness={1}/></mesh>{Array.from({length:6},(_,j)=><mesh key={j} position={[0,.012,(j-2.5)*.063]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.22,.023]}/><meshStandardMaterial color="#93938a"/></mesh>)}</group>;})}</group></>;
}

// Fictional survey suit inspired by the supplied cosmic character, built as rigid jointed parts.
function Armor({position,size,color='#dddfe9',glow=false}:{position:[number,number,number];size:[number,number,number];color?:string;glow?:boolean}){return <RoundedBox args={size} radius={.045} smoothness={3} position={position} castShadow><meshStandardMaterial color={color} metalness={.35} roughness={.38} emissive={glow?color:'#000000'} emissiveIntensity={glow?1.5:0}/></RoundedBox>;}
function AstronautSuit(){
 const limbs=useRef<(THREE.Group|null)[]>([]),phase=useRef(0),stride=useRef(0);
 useFrame((_,dt)=>{const s=useArchive.getState();if(s.paused)return;const moving=s.stage==='surface'&&!s.inspector&&flightInput.z<0&&s.walk<1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;stride.current=THREE.MathUtils.damp(stride.current,moving?1:0,8,dt);if(moving)phase.current+=Math.min(dt,.05)*5;limbs.current.forEach((limb,i)=>{if(limb)limb.rotation.x=Math.sin(phase.current+(i%2?Math.PI:0))*stride.current*(i<2?.32:-.25);});});
 return <group>
 <Armor position={[0,1.38,0]} size={[.75,.68,.46]} color="#242044"/>
 <Armor position={[0,1.07,0]} size={[.7,.16,.49]} color="#d4ad65"/>
 <mesh position={[0,2.02,0]} castShadow><sphereGeometry args={[.43,32,24]}/><meshStandardMaterial color="#dddfe9" metalness={.5} roughness={.3}/></mesh>
 <mesh position={[0,2.04,.19]} scale={[1,.82,.7]}><sphereGeometry args={[.37,32,24]}/><meshStandardMaterial color="#191732" metalness={.8} roughness={.16} emissive="#422677" emissiveIntensity={.35}/></mesh>
 <mesh position={[0,1.75,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.32,.045,8,40]}/><meshStandardMaterial color="#d4ad65" metalness={.7} roughness={.3}/></mesh>
 {[-1,1].map((side,i)=><group key={side}>
 <mesh position={[side*.43,2.04,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.19,.19,.13,32]}/><meshStandardMaterial color="#242039" roughness={.65}/></mesh>
 <mesh position={[side*.51,2.04,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.175,.175,.08,32]}/><meshStandardMaterial color="#dddfe9" metalness={.4} roughness={.3}/></mesh>
 <mesh position={[side*.557,2.04,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.12,.024,8,32]}/><meshStandardMaterial color="#ad8bff" emissive="#7956df" emissiveIntensity={.8}/></mesh>
 <group ref={el=>{limbs.current[i]=el;}} position={[side*.22,1,0]}><Armor position={[0,-.23,0]} size={[.3,.44,.34]} color="#302649"/><Armor position={[0,-.46,.035]} size={[.31,.16,.37]}/><Armor position={[0,-.67,0]} size={[.3,.32,.34]} color="#25253e"/><Armor position={[0,-.86,.09]} size={[.35,.2,.5]}/><Armor position={[0,-.64,.18]} size={[.17,.035,.015]} color="#b998ff" glow/></group>
 <group ref={el=>{limbs.current[i+2]=el;}} position={[side*.49,1.63,0]} rotation={[0,0,side*.1]}><Armor position={[0,-.12,0]} size={[.27,.3,.36]} color="#62508e"/><Armor position={[0,-.37,0]} size={[.25,.2,.3]} color="#25253e"/><Armor position={[0,-.55,.015]} size={[.29,.22,.34]}/><Armor position={[0,-.7,.02]} size={[.23,.16,.27]} color="#33304d"/><Armor position={[0,-.49,.19]} size={[.18,.035,.015]} color="#b998ff" glow/></group>
 <Armor position={[side*.25,1.43,.26]} size={[.065,.51,.07]}/>
 </group>)}
 <Armor position={[0,1.46,-.35]} size={[.68,.6,.24]} color="#29203d"/>
 <mesh position={[0,1.48,-.5]} rotation={[0,Math.PI,0]}><circleGeometry args={[.235,40]}/><meshStandardMaterial color="#34215c" emissive="#613b9f" emissiveIntensity={.5}/></mesh>
 <mesh position={[0,1.48,-.52]} rotation={[.2,.2,-.4]} scale={[1,.65,1]}><torusGeometry args={[.27,.018,8,48]}/><meshStandardMaterial color="#dfb875" metalness={.65} roughness={.3}/></mesh>
 {Array.from({length:18},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*(.035+i*.009),1.48+Math.cos(i*2.4)*(.035+i*.009),-.53]}><sphereGeometry args={[i%4===0?.018:.008,6,6]}/><meshBasicMaterial color={i%3?'#cebcff':'#8ce5ff'}/></mesh>)}
 <mesh position={[0,2.04,0]} castShadow><torusGeometry args={[.46,.05,12,48,Math.PI]}/><meshStandardMaterial color="#29233f" metalness={.35} roughness={.4}/></mesh>
 <mesh position={[0,2.04,-.035]}><torusGeometry args={[.46,.022,8,48,Math.PI]}/><meshStandardMaterial color="#b5a0de" metalness={.4} roughness={.35}/></mesh>
 </group>;
}

export default memo(Explorer);
