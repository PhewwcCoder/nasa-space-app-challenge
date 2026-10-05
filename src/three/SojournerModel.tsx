import { Strut, useHardwareMaterial } from './HardwareSurfaces';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useArchive } from '../stores/archive';

type V3 = [number,number,number];
function Box({at,size,color='#b7a48b',metal=.6}:{at:V3;size:V3;color?:string;metal?:number}) {
  return <mesh position={at} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={metal} roughness={.48}/></mesh>;
}
function Part({id,offset,children}:{id:string;offset:V3;children:React.ReactNode}) {
  const ref=useRef<THREE.Group>(null);const {inspector,selected,exploded,isolated,select,scanProgress,paused}=useArchive();
  const active=inspector==='sojourner'&&scanProgress===1;
  useFrame((_,dt)=>{if(!ref.current||paused)return;const t=active&&(exploded||selected===id)?1:0;const k=matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*5);ref.current.position.lerp(new THREE.Vector3(...offset).multiplyScalar(t),k);});
  return <group ref={ref} visible={!active||!isolated||!selected||selected===id} onClick={e=>{if(active){e.stopPropagation();select(id);}}}>{children}{active&&selected===id&&<mesh position={[0,.27,0]}><boxGeometry args={[.76,.47,.57]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/><Edges color="#a0e0e5"/></mesh>}</group>;
}
export default function SojournerModel(){const foil=useHardwareMaterial('#bb914f',.65);return <group>
  <mesh position={[0,.21,0]} castShadow material={foil}><boxGeometry args={[.48,.16,.32]}/></mesh>
  {[-1,1].map(s=><group key={`body-${s}`}><Strut from={[-.23,.15,s*.17]} to={[.23,.15,s*.17]} radius={.009}/>{[-.19,-.1,0,.1,.19].map(x=><mesh key={x} position={[x,.275,s*.178]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.006,.006,.008,8]}/><meshStandardMaterial color="#dad5c6" metalness={.8} roughness={.4}/></mesh>)}</group>)}
  {[-1,1].map(s=><group key={s}><Box at={[0,.25,s*.166]} size={[.43,.095,.013]} color="#c8bfa7"/>{Array.from({length:9},(_,i)=><Box key={i} at={[-.19+i*.048,.26,s*.175]} size={[.012,.08,.008]} color="#7e7263"/>)}</group>)}
  <Part id="solar" offset={[0,.35,0]}>
    <Box at={[0,.325,0]} size={[.66,.022,.44]} color="#c2b9a6"/>
    {Array.from({length:84},(_,i)=><Box key={i} at={[(i%12-5.5)*.052,.339,(Math.floor(i/12)-3)*.058]} size={[.049,.003,.054]} color={i%3===0?'#252b48':'#333b55'} metal={.55}/>)}
    {[-1,1].map(s=><Box key={s} at={[s*.322,.344,0]} size={[.009,.01,.44]} color="#dbd6c1"/>)}
  </Part>
  <Part id="wheels" offset={[0,-.01,.32]}>
    {[-1,1].map(s=><group key={s}>
      <Strut from={[-.25,.065,s*.23]} to={[-.1,.22,s*.2]} radius={.013}/><Strut from={[-.1,.22,s*.2]} to={[.02,.065,s*.23]} radius={.013}/><Strut from={[0,.065,s*.23]} to={[.13,.23,s*.2]} radius={.013}/><Strut from={[.13,.23,s*.2]} to={[.25,.065,s*.23]} radius={.013}/><Strut from={[-.1,.22,s*.2]} to={[.13,.23,s*.2]} radius={.014}/>
      {[-.25,0,.25].map((x,i)=><group key={i} position={[x,.065,s*.24]} rotation={[Math.PI/2,0,0]}>
        <mesh castShadow><cylinderGeometry args={[.065,.065,.06,28]}/><meshStandardMaterial color="#383b39" roughness={.83}/></mesh>
        <mesh position={[0,s*.033,0]}><cylinderGeometry args={[.047,.047,.006,24]}/><meshStandardMaterial color="#9d967c" metalness={.65} roughness={.6}/></mesh>
        {Array.from({length:16},(_,j)=><mesh key={j} position={[Math.cos(j*Math.PI/8)*.064,0,Math.sin(j*Math.PI/8)*.064]} rotation={[0,-j*Math.PI/8,0]}><boxGeometry args={[.012,.067,.007]}/><meshStandardMaterial color="#797767" metalness={.5} roughness={.7}/></mesh>)}
      </group>)}
    </group>)}
  </Part>
  <Part id="apxs" offset={[-.3,.05,0]}>
    <Strut from={[-.23,.19,0]} to={[-.38,.25,0]} radius={.012}/><Strut from={[-.38,.25,0]} to={[-.44,.13,0]} radius={.012}/>
    <mesh position={[-.44,.12,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.05,.045,.07,20]}/><meshStandardMaterial color="#b2aaa0" metalness={.7} roughness={.4}/></mesh>
    {[-.1,.1].map(z=><group key={z} position={[.25,.24,z]}><Box at={[0,0,0]} size={[.06,.065,.07]} color="#b6b6a5"/><mesh position={[.035,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.018,.018,.015,16]}/><meshStandardMaterial color="#111c24" metalness={.7} roughness={.15}/></mesh></group>)}
  </Part>
  <Line points={[[.19,.34,-.12],[.19,.61,-.12]]} color="#d0cbbb" lineWidth={1}/>
</group>;}

export function PathfinderModel(){const ramp=useRef<THREE.Group>(null);useFrame((_,dt)=>{if(!ramp.current||useArchive.getState().paused)return;const s=useArchive.getState(),angle=s.inspector==='pathfinder'&&s.evidenceStep<2?-.65:.13;ramp.current.rotation.x=THREE.MathUtils.damp(ramp.current.rotation.x,angle,matchMedia('(prefers-reduced-motion: reduce)').matches?1000:5,dt);});const fabric=useHardwareMaterial('#a9987d'),foil=useHardwareMaterial('#bc9556',.65);return <group>
  {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <group key={i} position={[Math.sin(a)*.91,.1,Math.cos(a)*.91]} rotation={[0,a,0]}><mesh scale={[.46,.13,.65]} castShadow receiveShadow material={fabric}><sphereGeometry args={[1,24,16]}/></mesh><Line points={[[-.25,.1,-.3],[-.1,.15,0],[.25,.07,.4]]} color="#6c6456" lineWidth={1}/></group>;})}
  <mesh position={[0,.31,0]}><cylinderGeometry args={[.64,.64,.16,3]}/><meshStandardMaterial color="#ae8550" metalness={.6} roughness={.5}/></mesh>
  {[0,1,2].map(i=><group key={i} rotation={[0,i*Math.PI*2/3,0]}>
    <mesh position={[0,.32,.99]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.85,3]}/><meshStandardMaterial color="#24304b" side={THREE.DoubleSide} metalness={.6} roughness={.45}/></mesh>
    {Array.from({length:8},(_,j)=><Line key={j} points={[[-.46+j*.12,.33,.57],[-.23+j*.06,.33,1.35]]} color="#8d8d91" lineWidth={.6}/>)}
    <Line points={[[-.72,.34,.58],[0,.34,1.84],[.72,.34,.58]]} color="#b2aaa0" lineWidth={2}/>
  </group>)}
  <mesh position={[0,.49,0]} castShadow material={foil}><boxGeometry args={[.65,.25,.5]}/></mesh>
  {[-.23,0,.23].map(x=><mesh key={x} position={[x,.66,.03]} scale={[.14,.13,.22]} material={fabric}><sphereGeometry args={[1,16,12]}/></mesh>)}
  <Line points={[[-.3,.64,.22],[-.42,.44,.7],[.2,.35,1.3]]} color="#c6b69b" lineWidth={2}/>
  <Strut from={[.15,.58,0]} to={[.15,1.48,0]} radius={.025}/>
  <Box at={[.15,1.48,0]} size={[.2,.1,.13]} color="#c2bdb0"/>
  {[-.06,.06].map(x=><mesh key={x} position={[.15+x,1.48,.071]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.028,.028,.01,16]}/><meshStandardMaterial color="#0b1420"/></mesh>)}
  <mesh position={[-.32,.72,0]} rotation={[.4,0,0]}><cylinderGeometry args={[.19,.1,.08,32]}/><meshStandardMaterial color="#e3dac5" metalness={.35} roughness={.5}/></mesh>
  <group ref={ramp} position={[.1,.18,1.9]} rotation={[.13,0,0]}><Box at={[0,0,0]} size={[.55,.035,1.3]} color="#84847b"/>{[-1,1].map(s=><Box key={s} at={[s*.22,.025,0]} size={[.045,.025,1.3]} color="#cec4ae"/>)}</group>
</group>;}
