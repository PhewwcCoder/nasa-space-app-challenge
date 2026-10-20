import { memo } from 'react';
import { useSceneFrame as useFrame } from './SceneActivity';
import { useRef, useMemo, useEffect } from 'react';
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

// Reference-inspired EVA suit. Original geometry; not an exact flight-suit reconstruction.
function SuitPanel({position,size,color='#eeeae1'}:{position:[number,number,number];size:[number,number,number];color?:string}) {
 return <RoundedBox args={size} radius={Math.min(.035, ...size.map(n => n / 2 - .0001))} smoothness={3} position={position} castShadow><meshStandardMaterial color={color} roughness={.85}/></RoundedBox>;
}
function FabricLimb({length,radius}:{length:number;radius:number}) {
 const geometry=useMemo(()=>{
  const g=new THREE.CylinderGeometry(radius*.9,radius,length,24,32),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i),a=Math.atan2(p.getZ(i),p.getX(i));const fold=1+.045*Math.sin(y*95+a*2)+.022*Math.sin(y*160-a*4);p.setX(i,p.getX(i)*fold);p.setZ(i,p.getZ(i)*fold);}
  g.computeVertexNormals();return g;
 },[length,radius]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} position={[0,-length/2,0]} castShadow><meshStandardMaterial color="#e6e3db" roughness={.94}/></mesh>;
}
function SuitHose(){const curve=useMemo(()=>new THREE.CatmullRomCurve3([new THREE.Vector3(.19,1.39,.32),new THREE.Vector3(.34,1.12,.4),new THREE.Vector3(.36,.82,.34),new THREE.Vector3(.2,.76,.3),new THREE.Vector3(.09,1.12,.28)]),[]);return <mesh><tubeGeometry args={[curve,48,.025,8,false]}/><meshStandardMaterial color="#dad8cc" roughness={.9}/></mesh>;}
function FlagPatch(){return <group position={[0,1.58,-.525]} rotation={[0,Math.PI,0]}><mesh><planeGeometry args={[.3,.18]}/><meshStandardMaterial color="#f5f0e5"/></mesh>{Array.from({length:7},(_,i)=><mesh key={i} position={[0,.077-i*.026,.002]}><planeGeometry args={[.3,.012]}/><meshStandardMaterial color="#ab3c35"/></mesh>)}<mesh position={[-.082,.039,.004]}><planeGeometry args={[.135,.103]}/><meshStandardMaterial color="#233f65"/></mesh>{Array.from({length:12},(_,i)=><mesh key={i} position={[-.13+(i%4)*.03,.075-Math.floor(i/4)*.03,.006]}><circleGeometry args={[.006,5]}/><meshBasicMaterial color="#f4eee0"/></mesh>)}</group>;}
export function AstronautSuit({isWalking}:{isWalking?:()=>boolean}){
 const limbs=useRef<(THREE.Group|null)[]>([]),phase=useRef(0),stride=useRef(0);
 useFrame((_,dt)=>{const s=useArchive.getState();if(s.paused)return;const moving=(isWalking?isWalking():s.stage==='surface'&&!s.inspector&&flightInput.z<0&&s.walk<1)&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;stride.current=THREE.MathUtils.damp(stride.current,moving?1:0,8,dt);if(moving)phase.current+=Math.min(dt,.05)*5;limbs.current.forEach((limb,i)=>{if(limb)limb.rotation.x=Math.sin(phase.current+(i%2?Math.PI:0))*stride.current*(i<2?.32:-.25);});});
 return <group name="suited-visitor" scale={1.85 / (2.43 - .0105)}><group position={[0,-.0105,0]}>
 <mesh position={[0,1.4,0]} scale={[.39,.44,.27]} castShadow><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color="#eeeae3" roughness={.93}/></mesh>
 <SuitPanel position={[0,1.05,0]} size={[.65,.24,.45]}/>
 <mesh position={[0,2.02,0]} castShadow><sphereGeometry args={[.41,40,32]}/><meshStandardMaterial color="#f2f0e7" roughness={.55}/></mesh>
 <mesh position={[0,2.04,.205]} scale={[.88,.94,.58]}><sphereGeometry args={[.355,40,32]}/><meshStandardMaterial color="#090f14" metalness={.8} roughness={.12}/></mesh>
 <mesh position={[-.1,2.19,.39]} rotation={[0,.1,-.3]} scale={[1,.14,1]}><sphereGeometry args={[.1,20,12]}/><meshStandardMaterial color="#b5c9cd" metalness={.7} roughness={.2}/></mesh>
 <mesh position={[0,1.75,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.29,.055,12,48]}/><meshStandardMaterial color="#c8c9c4" metalness={.6} roughness={.4}/></mesh>
 <SuitPanel position={[0,1.48,.29]} size={[.48,.32,.15]}/>
 <SuitPanel position={[0,1.5,.373]} size={[.22,.12,.025]} color="#a6aca8"/>
 {[-1,1].map((side,i)=><group key={side}>
  <SuitPanel position={[side*.38,2.13,.02]} size={[.12,.23,.22]}/>
  <mesh position={[side*.448,2.14,.06]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.032,.032,.014,16]}/><meshStandardMaterial color="#303731"/></mesh>
  <SuitPanel position={[side*.3,1.45,.27]} size={[.045,.55,.04]} color="#cacbc3"/>
  <mesh position={[side*.14,1.37,.39]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.045,.045,.04,20]}/><meshStandardMaterial color="#383f3b" metalness={.6}/></mesh>
  <group ref={el=>{limbs.current[i]=el;}} position={[side*.19,1.02,0]}>
   <FabricLimb length={.43} radius={.17}/><mesh position={[0,-.39,0]}><cylinderGeometry args={[.172,.177,.045,24]}/><meshStandardMaterial color="#b94132" roughness={.7}/></mesh>
   <group position={[0,-.44,0]}><FabricLimb length={.39} radius={.155}/></group>
   <SuitPanel position={[0,-.9,.08]} size={[.32,.21,.48]}/><SuitPanel position={[0,-.997,.08]} size={[.33,.025,.49]} color="#9d9e97"/>
  </group>
  <group ref={el=>{limbs.current[i+2]=el;}} position={[side*.43,1.65,0]} rotation={[0,0,side*.16]}>
   <FabricLimb length={.37} radius={.145}/><mesh position={[0,-.1,0]}><cylinderGeometry args={[.148,.155,.055,24]}/><meshStandardMaterial color="#b94132" roughness={.7}/></mesh>
   <group position={[0,-.37,0]} rotation={[-.12,0,0]}><FabricLimb length={.28} radius={.13}/>
    <mesh position={[0,-.29,0]}><cylinderGeometry args={[.132,.12,.055,24]}/><meshStandardMaterial color="#999d98" metalness={.4}/></mesh>
    <SuitPanel position={[0,-.37,.02]} size={[.2,.14,.18]}/>
    {Array.from({length:4},(_,j)=><mesh key={j} position={[(j-1.5)*.045,-.46,.05]} rotation={[.25,0,0]}><capsuleGeometry args={[.022,.09,4,8]}/><meshStandardMaterial color={j===3?'#dddcd1':'#656c67'} roughness={.8}/></mesh>)}
   </group>
  </group>
 </group>)}
 <SuitPanel position={[0,1.46,-.36]} size={[.65,.85,.31]}/><SuitPanel position={[0,1.05,-.38]} size={[.72,.25,.34]} color="#d0d2c9"/>
 <SuitPanel position={[0,1.94,-.32]} size={[.52,.2,.29]}/><FlagPatch/><SuitHose/>
 {[-1,1].map(side=><SuitPanel key={side} position={[side*.3,1.46,-.53]} size={[.045,.76,.035]} color="#aeb2aa"/>)}
 {Array.from({length:10},(_,i)=><mesh key={i} position={[(i%5-2)*.12,1.02+Math.floor(i/5)*.1,-.556]}><circleGeometry args={[.012,8]}/><meshStandardMaterial color="#555e59" side={THREE.DoubleSide}/></mesh>)}
 </group></group>;
}
export default memo(Explorer);
